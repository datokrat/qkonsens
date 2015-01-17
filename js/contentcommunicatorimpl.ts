///<reference path='../typings/disco.d.ts' />
import discoContext = require('discocontext')

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
}

export = ContentCommunicator;