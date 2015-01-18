///<reference path='../typings/disco.d.ts' />
import discoContext = require('discocontext')
import Common = require('common');

import IContentCommunicator = require('contentcommunicator')
import Events = require('event')
import ContentModel = require('contentmodel');

class ContentCommunicator implements IContentCommunicator.Main {
	public generalContentRetrieved = new Events.EventImpl<IContentCommunicator.GeneralContentRetrievedArgs>();
	public contextRetrieved = new Events.EventImpl<IContentCommunicator.ContextRetrievedArgs>();
	
	public query(id: number) {
		throw new Error('not implemented');
	}
	
	public queryGeneral(id: number) {
		throw new Error('not implemented');
	}
	
	public queryContext(id: number) {
		throw new Error('not implemented');
	}
	
	public updateGeneral(model: ContentModel.General, callbacks: { then: () => void; error: (error) => void }) {
		discoContext.Posts.filter('it.Id == this.Id', { Id: model.postId.toString() })
		.include('Content').toArray().then(rsp => {
			var post = rsp[0];
			if(post) {
				discoContext.Content.attach(post.Content);
				post.Content.Title = model.title();
				post.Content.Text = model.text();
				discoContext.saveChanges(callbacks.then);
			}
			else {
				alert('ContentCommunicator.updateGeneral: Das zu ändernde Element existiert nicht (mehr)!');
				callbacks.error(new Error('post not found'));
			}
		});
	}
	
	public updateContext(model: ContentModel.Context, callbacks: { then: () => void; error: (error) => void }) {
        var contextFilter = discoContext.PostReferences.filter
			('it.ReferenceType.Description.Name == "Context"' + '&& it.ReferrerId == this.ReferrerId', 
			{ ReferrerId: model.postId.toString() })
			.include('ReferenceType.Description')
			.include('Referree.Content');
		
		var postResult: Disco.Ontology.Post[];
		var contextResult: Disco.Ontology.PostReference[];
		var context: Disco.Ontology.Post;
		Common.Callbacks.batch([
			r => {
				discoContext.Posts.filter('it.Id == this.Id', { Id: model.postId.toString() }).toArray().then(rsp => {
					postResult = rsp;
					r();
				})
				.fail(callbacks.error);
			},
			r => {
				if(postResult.length <= 0) throw new Error('updateContext: Post not found');
				else r();
			},
			r => {
				contextFilter.toArray().then(rsp => {
					contextResult = rsp;
					r();
				})
				.fail(callbacks.error);
			},
			r => {
				context = Common.Coll.where(contextResult, item => item.ReferenceType.Description.Name == 'Context')[0].Referree;
				if(!context) throw new Error('context does not exist');
				else r();
			},
			r => {
				discoContext.Content.attach(context.Content);
				context.Content.Text = model.text();
				discoContext.saveChanges(() => r()).fail(callbacks.error);
			},
		], err => {
			if(!err) callbacks.then();
			else { console.log(err); callbacks.error(err); }
		});
		
		contextFilter.include('ReferenceType.Description').toArray().then(refs => {
			
		});
	}
}

export = ContentCommunicator;