import Evt = require('event');
import Topic = require('topic');

export class Main implements Topic.Communicator {
	childrenReceived: Evt.Event<Topic.ChildrenReceivedArgs> = new Evt.EventImpl<Topic.ChildrenReceivedArgs>();
	
	public queryChildren(id: Topic.TopicIdentifier): void {
		if(id.root) this.queryRootChildren();
		else this.queryNonRootChildren(id.id);
	}
	
	private queryRootChildren(): void {
		throw new Error('not implemented');
	}
	
	private queryNonRootChildren(id: number): void {
		throw new Error('not implemented');
	}
}