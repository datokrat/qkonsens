import Events = require('event')
import Comment = require('comment')
import ContentCommunicator = require('contentcommunicator')
//import DiscussableParser = require('discoparsers/discussable')

import discoContext = require('discocontext')

export interface Base {
	content: ContentCommunicator.Main;

	commentsReceived: Events.Event<ReceivedArgs>;
	commentsReceiptError: Events.Event<CommentsReceiptErrorArgs>;
	queryCommentsOf(discussableId: number, err?: (error) => void): void;
}

export class Main implements Base {
	public content: ContentCommunicator.Main;
	public commentsReceived: Events.Event<ReceivedArgs> = new Events.EventImpl<ReceivedArgs>();
	public commentsReceiptError: Events.Event<CommentsReceiptErrorArgs> = new Events.EventImpl<CommentsReceiptErrorArgs>();
	
	public queryCommentsOf(discussableId: number, err?: (error) => void): void {
		this.queryRawCommentsOf(discussableId).then(comments => {
			var parsed = this.parseComments(comments);
			this.commentsReceived.raise({ id: discussableId, comments: parsed });
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