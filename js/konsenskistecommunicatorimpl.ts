import Events = require('event')
import Common = require('common');
import discoContext = require('discocontext')

import IKonsenskisteCommunicator = require('konsenskistecommunicator')
import ContentCommunicator = require('contentcommunicatorimpl')
import KernaussageCommunicator = require('kernaussagecommunicatorimpl')
import DiscussionCommunicator = require('discussioncommunicator')
import DiscussionCommunicatorImpl = require('discussioncommunicatorimpl')
import RatingCommunicator = require('ratingcommunicator')
import RatingCommunicatorImpl = require('ratingcommunicatorimpl')
import IContentCommunicator = require('contentcommunicator')
import IKernaussageCommunicator = require('kernaussagecommunicator')

import Environs = require('environs')


import KonsenskisteModel = require('konsenskistemodel')
import KernaussageModel = require('kernaussagemodel')
import ContentModel = require('contentmodel')
import Topic = require('topic');

export class Main implements IKonsenskisteCommunicator.Main {
	public content: IContentCommunicator.Main;
	public kernaussage: IKernaussageCommunicator.Main;
	public discussion: DiscussionCommunicator.Base;
	public rating: RatingCommunicator.Base;
    
    public environs: Environs.Communicator;
    
	public received = new Events.EventImpl<IKonsenskisteCommunicator.ReceivedArgs>();
	public receiptError = new Events.EventImpl<IKonsenskisteCommunicator.ReceiptErrorArgs>();
	public kernaussageAppended = new Events.EventImpl<IKonsenskisteCommunicator.KaAppendedArgs>();
	public kernaussageAppendingError = new Events.EventImpl<IKonsenskisteCommunicator.KaAppendingErrorArgs>();
	private parser = new Parser();
	
	constructor() {
		this.content = new ContentCommunicator;
		this.discussion = new DiscussionCommunicatorImpl.Main();
		this.discussion.content = this.content;
		this.kernaussage = new KernaussageCommunicator.Main({ content: this.content });
		this.rating = new RatingCommunicatorImpl.Main();
        this.environs = new Environs.Communicator();
	}
	
	public createAndAppendKa(kokiId: number, kaData: IKonsenskisteCommunicator.KernaussageData) {
		var onError = (message: any) => {
			this.kernaussageAppendingError.raise({ konsenskisteId: kokiId, message: message.toString() });
		};
		
		var content: Disco.Ontology.Content;
		var post: Disco.Ontology.Post;
		var reference = new Disco.Ontology.PostReference();
		var cxtContent = new Disco.Ontology.Content();
		var cxtPost = new Disco.Ontology.Post();
		var cxtReference = new Disco.Ontology.PostReference();
		
		var batch = [
			r => {
				content = this.createContent(kaData, () => r(), err => onError(err));
			},
			r => {
				post = this.createPost({ typeId: '6', contentId: content.Id }, () => r(), err => onError(err));
			},
			r => {
				reference = this.createPostReference({ typeId: '11', referrerId: post.Id, referreeId: kokiId.toString() }, 
					() => r(), err => onError(err));
			},
			kaData.context ?
			(r => Common.Callbacks.batch([
				r => {
					cxtContent.Text = kaData.context;
					cxtContent.CultureId = '2';
					discoContext.Content.add(cxtContent);
					discoContext.saveChanges().then(() => r()).fail(error => onError(error));
				},
				r => {
					cxtPost.PostTypeId = '2';
					cxtPost.ContentId = cxtContent.Id;
					discoContext.Posts.add(cxtPost);
					discoContext.saveChanges().then(() => r()).fail(error => onError(error));
				},
				r => {
					cxtReference.ReferrerId = post.Id;
					cxtReference.ReferreeId = cxtPost.Id;
					cxtReference.ReferenceTypeId = '10';
					discoContext.PostReferences.add(cxtReference);
					discoContext.saveChanges().then(() => r()).fail(error => onError(error));
				}
			], r)) : r => r()
		]
		
		Common.Callbacks.batch(batch, (err) => {
			if(err)
				onError(err);
			else {
				this.kernaussageAppended.raise({
					konsenskisteId: kokiId,
					kernaussageId: parseInt(post.Id),
					kernaussageData: kaData 
				});
			}
		});
	}
	
	public query(id: number): KonsenskisteModel.Model {
		var onError = message => {
			out.queryState().error(message);
			out.queryState().loading(false);
			this.receiptError.raise({ id: id, message: message, konsenskiste: out });
		}; 
		var out = new KonsenskisteModel.Model();
		out.queryState().loading(true);
		out.id(id);
		
		this.queryRaw(id).then(rawKokis => {
			if(rawKokis.length != 1) {
				onError('koki id[' + id + '] could not be found');
				return;
			}
			out.queryState().error(null);
			out.queryState().loading(false);
			var parsedKoki = this.parser.parse(rawKokis[0], out);
			this.received.raise({ id: id, konsenskiste: parsedKoki });
		}).fail(error => onError("JayData request failed"));
		
		return out;
	}
	
	public create(kokiData: IKonsenskisteCommunicator.KonsenskisteData, parentTopicId: number,  then: (id: number) => void) {
		var content: Disco.Ontology.Content;
		var post: Disco.Ontology.Post;
		var topicReference: Disco.Ontology.PostReference;
		Common.Callbacks.batch([
			r => {
				content = this.createContent(kokiData, () => r(), err => { throw err });
			},
			r => {
				post = this.createPost({ typeId: '2', contentId: content.Id }, () => r(), err => { throw err });
			},
			r => {
				if(parentTopicId) {
					topicReference = this.createPostReference({ typeId: '2', referrerId: post.Id, referreeId: parentTopicId.toString() },
						() => r(), err => { throw err });
				}
				else r();
			}
		], err => {
			if(err) throw err;
			else then(parseInt(post.Id));
		});
	}
	
	private queryRaw(id: number) {
		return discoContext.Posts.filter(function(it) { return it.Id == this.Id }, { Id: id })
		.include("ReferredFrom.Referrer.Content")
		.include("ReferredFrom.Referrer.Ratings")
		.include("ReferredFrom.Referrer.Ratings.ModifiedBy.Author")
		.include("ReferredFrom.Referrer.ReferredFrom")
		.include("ReferredFrom.Referrer.ReferredFrom.ReferenceType.Description")
		.include("ReferredFrom.Referrer.RefersTo.Referree.Content")
		.include("ReferredFrom.Referrer.RefersTo.ReferenceType.Description")
		.include("ReferredFrom.ReferenceType.Description")
		.include("RefersTo.Referree")
		.include("RefersTo.Referree.Ratings")
		.include("RefersTo.Referree.Ratings.ModifiedBy.Author")
		.include("RefersTo.Referree.Content")
		.include("RefersTo.ReferenceType")
		.include("RefersTo.ReferenceType.Description")
		.include("Content")
		.include("Ratings")
		.include("Ratings.ModifiedBy.Author")
		.toArray();
	}
	
	private createContent(content: IKonsenskisteCommunicator.ContentData, then: (id: number) => void, fail: (err) => void): Disco.Ontology.Content {
		var discoContent = new Disco.Ontology.Content();
		discoContent.Title = content.title
		discoContent.Text = content.text;
		discoContent.CultureId = '2';
		
		discoContext.Content.add(discoContent);
		discoContext.saveChanges().then(() => then(parseInt(discoContent.Id))).fail(error => fail(error));
		
		return discoContent;
	}
	
	private createPost(props: { typeId: string; contentId: string }, then: () => void, fail: (err) => void): Disco.Ontology.Post {
		var discoPost = new Disco.Ontology.Post();
		discoPost.PostTypeId = props.typeId;
		discoPost.ContentId = props.contentId;
		
		discoContext.Posts.add(discoPost);
		discoContext.saveChanges().then(() => then()).fail(error => fail(error));
		
		return discoPost;
	}
	
	private createPostReference(props: { referrerId: string; referreeId: string; typeId: string }, then: () => void, fail: (err) => void): Disco.Ontology.PostReference {
		var discoReference = new Disco.Ontology.PostReference();
		discoReference.ReferrerId = props.referrerId;
		discoReference.ReferreeId = props.referreeId;
		discoReference.ReferenceTypeId = props.typeId;
		
		discoContext.PostReferences.add(discoReference);
		discoContext.saveChanges().then(() => then()).fail(error => fail(error));
		
		return discoReference;
	}
}

export class Parser {
	public parse(rawKoki: Disco.Ontology.Post, out?: KonsenskisteModel.Model): KonsenskisteModel.Model {
		out = out || new KonsenskisteModel.Model();
		out.id(parseInt(rawKoki.Id));
		this.parseGeneralContent(rawKoki, out.general());
		this.parseContext(rawKoki, out.context());
		if(rawKoki.Ratings) this.ratingParser.parse(rawKoki.Ratings, out.rating());
		
		if(rawKoki.ReferredFrom) {
			out.childKas.set([]);
			rawKoki.ReferredFrom.forEach(reference => {
				if(reference.ReferenceType.Description.Name == 'Part') {
					var ka = this.parseKa(reference.Referrer);
					out.childKas.push(ka);
				}
			});
		}
		
		return out;
	}
	
	public parseKa(rawKa: Disco.Ontology.Post): KernaussageModel.Model {
		var ka = new KernaussageModel.Model;
		ka.id(parseInt(rawKa.Id));
		this.parseGeneralContent(rawKa, ka.general());
		this.parseContext(rawKa, ka.context());
		this.ratingParser.parse(rawKa.Ratings, ka.rating());
		return ka;
	}
	
	public parseGeneralContent(rawPost: Disco.Ontology.Post, out?: ContentModel.General): ContentModel.General {
		out = out || new ContentModel.General;
		out.postId = parseInt(rawPost.Id);
		out.title(rawPost.Content.Title);
		out.text(rawPost.Content.Text);
		return out;
	}
	
	public parseContext(rawPost: Disco.Ontology.Post, out?: ContentModel.Context): ContentModel.Context {
		var rawContext = this.extractRawContext(rawPost);
		if(rawContext) {
			out = out || new ContentModel.Context;
			out.postId = parseInt(rawPost.Id);
			out.text(rawContext.Content.Text);
			return out;
		}
	}
	
	public extractRawContext(rawPost: Disco.Ontology.Post): Disco.Ontology.Post {
		if(!rawPost.RefersTo) return null;
		var ret: Disco.Ontology.Post;
		rawPost.RefersTo.forEach(reference => {
			if(reference.ReferenceType.Description.Name == 'Context') {
				ret = reference.Referree;
			}
		});
		return ret;
	}
	
	private ratingParser = new RatingCommunicatorImpl.Parser();
}