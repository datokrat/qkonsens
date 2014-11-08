///<reference path='../typings/disco.d.ts' />
import discoContext = require('discocontext')

import IContentCommunicator = require('contentcommunicator')
import Events = require('event')

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
}

export = ContentCommunicator;