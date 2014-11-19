import Evt = require('event');
import Topic = require('topic');

export class Main implements Topic.Communicator {
	childrenReceived: Evt.Event<Topic.ChildrenReceivedArgs>;
	
	public queryChildren(id: number): void {
		throw new Error('not implemented');
	}
}