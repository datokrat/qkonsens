import Events = require('event')
import Common = require('common');
import discoContext = require('discocontext')

import IKonsenskisteCommunicator = require('konsenskistecommunicator')
import ContentCommunicator = require('contentcommunicatorimpl')
import KernaussageCommunicator = require('kernaussagecommunicatorimpl')
import DiscussionCommunicator = require('discussioncommunicator')
import RatingCommunicator = require('ratingcommunicator')
import IContentCommunicator = require('contentcommunicator')
import IKernaussageCommunicator = require('kernaussagecommunicator')

import KonsenskisteModel = require('konsenskistemodel')
import KernaussageModel = require('kernaussagemodel')
import ContentModel = require('contentmodel')

export class Main implements IKonsenskisteCommunicator.Main {
	public content: IContentCommunicator.Main;
	public kernaussage: IKernaussageCommunicator.Main;
	public discussion: DiscussionCommunicator.Base;
	public rating: RatingCommunicator.Base;
	public received = new Events.EventImpl<IKonsenskisteCommunicator.ReceivedArgs>();
	public receiptError = new Events.EventImpl<IKonsenskisteCommunicator.ReceiptErrorArgs>();
	public kernaussageAppended = new Events.EventImpl<IKonsenskisteCommunicator.KaAppendedArgs>();
	public kernaussageAppendingError = new Events.EventImpl<IKonsenskisteCommunicator.KaAppendingErrorArgs>();
	private parser = new Parser();
	
	constructor() {
		this.content = new ContentCommunicator;
		this.discussion = new DiscussionCommunicator.Main();
		this.discussion.content = this.content;
		this.kernaussage = new KernaussageCommunicator.Main({ content: this.content });
		this.rating = new RatingCommunicator.Main();
	}
	
	public createAndAppendKa(kokiId: number, ka: KernaussageModel.Model) {
		var onError = (message: any) => {
			this.kernaussageAppendingError.raise({ konsenskisteId: kokiId, message: message.toString() });
		};
		
		var content = new Disco.Ontology.Content();
		var post = new Disco.Ontology.Post();
		var reference = new Disco.Ontology.PostReference();
		Common.Callbacks.batch([
			r => {
				content.Title = ka.general().title();
				content.Text = ka.general().text();
				content.CultureId = '2';
				discoContext.Content.add(content);
				discoContext.saveChanges().then(() => r()).fail(error => onError(error));
			},
			r => {
				post.PostTypeId = '2';
				post.ContentId = content.Id;
				discoContext.Posts.add(post);
				discoContext.saveChanges().then(() => r()).fail(error => onError(error));
			},
			r => {
				reference.ReferrerId = post.Id;
				reference.ReferreeId = kokiId.toString();
				reference.ReferenceTypeId = '11';
				discoContext.PostReferences.add(reference);
				discoContext.saveChanges().then(() => r()).fail(error => onError(error));
			}
		], (err) => {
			if(err)
				onError(err);
			else {
				ka.id(parseInt(post.Id));
				this.kernaussageAppended.raise({ konsenskisteId: kokiId, kernaussage: ka });
			}
		});
	}
	
	public query(id: number): KonsenskisteModel.Model {
		var onError = message => {
			out.error(message);
			out.loading(false);
			this.receiptError.raise({ id: id, message: message, konsenskiste: out });
		};
		var out = new KonsenskisteModel.Model();
		out.loading(true);
		out.id(id);
		
		this.queryRaw(id).then(rawKokis => {
			if(rawKokis.length != 1) {
				onError('koki id[' + id + '] could not be found');
				return;
			}
			out.error(null);
			out.loading(false);
			var parsedKoki = this.parser.parse(rawKokis[0], out);
			this.received.raise({ id: id, konsenskiste: parsedKoki });
		}).fail(error => onError("JayData request failed"));
		
		return out;
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
}

export class Parser {
	public parse(rawKoki: Disco.Ontology.Post, out?: KonsenskisteModel.Model): KonsenskisteModel.Model {
		out = out || new KonsenskisteModel.Model();
		out.id(parseInt(rawKoki.Id));
		this.parseGeneralContent(rawKoki, out.general());
		this.parseContext(rawKoki, out.context());
		this.ratingParser.parse(rawKoki.Ratings, out.rating());
		
		rawKoki.ReferredFrom.forEach(reference => {
			if(reference.ReferenceType.Description.Name == 'Part') {
				var ka = this.parseKa(reference.Referrer);
				out.childKas.push(ka);
			}
		});
		
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
		out.title(rawPost.Content.Title);
		out.text(rawPost.Content.Text);
		return out;
	}
	
	public parseContext(rawPost: Disco.Ontology.Post, out?: ContentModel.Context): ContentModel.Context {
		var rawContext = this.extractRawContext(rawPost);
		if(rawContext) {
			out = out || new ContentModel.Context;
			out.text(rawContext.Content.Text);
			return out;
		}
	}
	
	public extractRawContext(rawPost: Disco.Ontology.Post): Disco.Ontology.Post {
		var ret: Disco.Ontology.Post;
		rawPost.RefersTo.forEach(reference => {
			if(reference.ReferenceType.Description.Name == 'Context') {
				ret = reference.Referree;
			}
		});
		return ret;
	}
	
	private ratingParser = new RatingCommunicator.Parser();
}