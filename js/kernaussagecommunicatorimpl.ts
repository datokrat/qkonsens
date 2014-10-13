import KernaussageCommunicator = require('kernaussagecommunicator')
import DiscussionCommunicator = require('discussioncommunicator')
import ContentCommunicator = require('contentcommunicator')
import ContentCommunicatorImpl = require('contentcommunicatorimpl')
import Events = require('event')

class KernaussageCommunicatorImpl implements KernaussageCommunicator.Main {
	public content: ContentCommunicator.Main;
	public discussion = new DiscussionCommunicator.Main;
	
	constructor(cxt: { content: ContentCommunicator.Main } = { content: new ContentCommunicatorImpl }) {
		this.content = cxt.content;
	}
	
	public received = new Events.EventImpl<KernaussageCommunicator.ReceivedArgs>();
	
	public query(id: number) {
		throw new Error('not implemented');
	}
}

export = KernaussageCommunicatorImpl;