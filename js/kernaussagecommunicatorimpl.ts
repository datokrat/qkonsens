import KernaussageCommunicator = require('kernaussagecommunicator')
import DiscussableCommunicator = require('discussablecommunicator')
import ContentCommunicator = require('contentcommunicator')
import ContentCommunicatorImpl = require('contentcommunicatorimpl')
import Events = require('event')

class KernaussageCommunicatorImpl extends DiscussableCommunicator.Main implements KernaussageCommunicator.Main {
	public content: ContentCommunicator.Main;
	
	constructor(cxt: { content: ContentCommunicator.Main } = { content: new ContentCommunicatorImpl }) {
		super();
		this.content = cxt.content;
	}
	
	public received = new Events.EventImpl<KernaussageCommunicator.ReceivedArgs>();
	
	public query(id: number) {
		throw new Error('not implemented');
	}
}

export = KernaussageCommunicatorImpl;