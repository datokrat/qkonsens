import Evt = require('event');
import Topic = require('topic');

export class Main implements Topic.Communicator {
	childrenReceived: Evt.Event<Topic.ChildrenReceivedArgs>;
	
	public queryChildren(id: Topic.TopicIdentifier): void {
		throw new Error('not implemented');
	}
}