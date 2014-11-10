import Events = require('event')
import Common = require('common');
import Comment = require('comment')
import ContentCommunicator = require('contentcommunicator')
//import DiscussableParser = require('discoparsers/discussable')

import discoContext = require('discocontext')

export interface Base {
	content: ContentCommunicator.Main;

	commentsReceived: Events.Event<ReceivedArgs>;
	commentsReceiptError: Events.Event<CommentsReceiptErrorArgs>;
	queryCommentsOf(discussableId: number, err?: (error) => void): void;
	
	commentAppended: Events.Event<AppendedArgs>;
	commentAppendingError: Events.Event<AppendingErrorArgs>;
	appendComment(discussableId: number, comment: Comment.Model): void;
}

export class Main implements Base {
	public content: ContentCommunicator.Main;
	public commentsReceived: Events.Event<ReceivedArgs> = new Events.EventImpl<ReceivedArgs>();
	public commentsReceiptError: Events.Event<CommentsReceiptErrorArgs> = new Events.EventImpl<CommentsReceiptErrorArgs>();
	public commentAppended: Events.Event<AppendedArgs> = new Events.EventImpl<AppendedArgs>();
	public commentAppendingError: Events.Event<AppendingErrorArgs> = new Events.EventImpl<AppendingErrorArgs>();
	
	public queryCommentsOf(discussableId: number, err?: (error) => void): void {
		this.queryRawCommentsOf(discussableId).then(comments => {
			var parsed = this.parseComments(comments);
			this.commentsReceived.raise({ id: discussableId, comments: parsed });
		});
	}
	
	public appendComment(discussableId: number, comment: Comment.Model) {
		var onError = error => this.commentAppendingError.raise({ discussableId: discussableId, error: error });
		var content: Disco.Ontology.Content;
		var post: Disco.Ontology.Post;
		var reference: Disco.Ontology.PostReference;
		Common.Callbacks.batch([
			r => {
				content = new Disco.Ontology.Content();
				content.CultureId = '2';
				content.Title = comment.content().title();
				content.Text = comment.content().text();
				discoContext.add(content);
				discoContext.saveChanges(() => r()).fail(onError);
			},
			r => {
				post = new Disco.Ontology.Post();
				post.ContentId = content.Id;
				post.PostTypeId = '2';
				discoContext.add(post);
				discoContext.saveChanges(() => r()).fail(onError);
			},
			r => {
				reference = new Disco.Ontology.PostReference();
				reference.ReferrerId = post.Id;
				reference.ReferreeId = discussableId.toString();
				reference.ReferenceTypeId = '2';
				discoContext.add(reference);
				discoContext.saveChanges().then(() => r()).fail(onError);
			}
		], () => {
			comment.id = parseInt(post.Id);
			this.commentAppended.raise({ discussableId: discussableId, comment: comment });
		});
	}
	
	private queryRawCommentsOf(discussableId: number) {
		return discoContext.PostReferences.filter(
			'it.ReferenceType.Description.Name != "Part" \
			&& it.ReferenceType.Description.Name != "Child" \
			&& it.ReferenceType.Description.Name != "Context" \
			&& it.Referree.Id == this.Id', { Id: discussableId })
		.include('Referrer.Content')
		.toArray();
	}
	
	private parseComments(rawComments: Disco.Ontology.PostReference[]) {
		var comments: Comment.Model[] = [];
		rawComments.forEach(reference => {
			var comment = this.parseComment(reference.Referrer);
			comments.push(comment);
		});
		return comments;
	}
	
	private parseComment(comment: Disco.Ontology.Post) {
		var ret = new Comment.Model();
		ret.id = parseInt(comment.Id);
		ret.content().title(comment.Content.Title);
		ret.content().text(comment.Content.Text);
		return ret;
	}
}

export interface ReceivedArgs {
	id: number;
	comments: Comment.Model[];
}

export interface CommentsReceiptErrorArgs {
	discussableId: number;
	message: string;
}

export interface AppendedArgs {
	discussableId: number;
	comment: Comment.Model;
}

export interface AppendingErrorArgs {
	discussableId: number;
	error: any;
}