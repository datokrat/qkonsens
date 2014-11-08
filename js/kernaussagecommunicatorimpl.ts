import KernaussageCommunicator = require('kernaussagecommunicator')
import DiscussionCommunicator = require('discussioncommunicator')
import RatingCommunicator = require('ratingcommunicator');
import ContentCommunicator = require('contentcommunicator')
import ContentCommunicatorImpl = require('contentcommunicatorimpl')
import Events = require('event')

export class Main implements KernaussageCommunicator.Main {
	public content: ContentCommunicator.Main;
	public discussion = new DiscussionCommunicator.Main;
	public rating = new RatingCommunicator.Main;
	
	constructor(cxt: { content: ContentCommunicator.Main } = { content: new ContentCommunicatorImpl }) {
		this.content = cxt.content;
		this.discussion.content = this.content;
	}
	
	public received = new Events.EventImpl<KernaussageCommunicator.ReceivedArgs>();
	
	public query(id: number) {
		throw new Error('not implemented');
	}
}

export class Parser {
	
}