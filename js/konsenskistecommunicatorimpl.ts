import Events = require('event')
import discoContext = require('discocontext')

import IKonsenskisteCommunicator = require('konsenskistecommunicator')
import ContentCommunicator = require('contentcommunicatorimpl')
import KernaussageCommunicator = require('kernaussagecommunicatorimpl')
import DiscussionCommunicator = require('discussioncommunicator')
import IContentCommunicator = require('contentcommunicator')
import IKernaussageCommunicator = require('kernaussagecommunicator')

import KonsenskisteModel = require('konsenskistemodel')
import KernaussageModel = require('kernaussagemodel')
import ContentModel = require('contentmodel')

class KonsenskisteCommunicator extends DiscussionCommunicator.Main implements IKonsenskisteCommunicator.Main {
	public content: IContentCommunicator.Main;
	public kernaussage: IKernaussageCommunicator.Main;
	public received = new Events.EventImpl<IKonsenskisteCommunicator.ReceivedArgs>();
	
	constructor() {
		super();
		this.content = new ContentCommunicator;
		this.kernaussage = new KernaussageCommunicator({ content: this.content });
	}
	
	public queryKoki(id: number, err?: (error) => void) {
		this.queryRaw(id).then(rawKokis => {
			if(rawKokis.length != 1) {
				var error = new Error('KonsenskisteCommunicatorImpl.query: a single koki could not be found for this id.');
				err && err(error);
				throw error;
			}
			var parsedKoki = this.parse(rawKokis[0]);
			this.received.raise({ id: id, konsenskiste: parsedKoki });
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
	
	private parse(rawKoki: Disco.Ontology.Post): KonsenskisteModel.Model {
		var koki = new KonsenskisteModel.Model;
		koki.id(parseInt(rawKoki.Id));
		this.parseGeneralContent(rawKoki, koki.general());
		this.parseContext(rawKoki, koki.context());
		
		rawKoki.ReferredFrom.forEach(reference => {
			if(reference.ReferenceType.Description.Name == 'Part') {
				var ka = this.parseKa(reference.Referrer);
				koki.childKas.push(ka);
			}
		});
		
		return koki;
	}
	
	parseKa(rawKa: Disco.Ontology.Post): KernaussageModel.Model {
		var ka = new KernaussageModel.Model;
		ka.id(parseInt(rawKa.Id));
		this.parseGeneralContent(rawKa, ka.general());
		this.parseContext(rawKa, ka.context());
		return ka;
	}
	
	parseGeneralContent(rawPost: Disco.Ontology.Post, out?: ContentModel.General): ContentModel.General {
		out = out || new ContentModel.General;
		out.title(rawPost.Content.Title);
		out.text(rawPost.Content.Text);
		return out;
	}
	
	parseContext(rawPost: Disco.Ontology.Post, out?: ContentModel.Context): ContentModel.Context {
		var rawContext = this.extractRawContext(rawPost);
		if(rawContext) {
			out = out || new ContentModel.Context;
			out.text(rawContext.Content.Text);
			return out;
		}
	}
	
	extractRawContext(rawPost: Disco.Ontology.Post): Disco.Ontology.Post {
		var ret: Disco.Ontology.Post;
		rawPost.RefersTo.forEach(reference => {
			if(reference.ReferenceType.Description.Name == 'Context') {
				ret = reference.Referree;
			}
		});
		return ret;
	}
}

export = KonsenskisteCommunicator;