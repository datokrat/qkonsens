import Evt = require('../event');
import ItemContainer = require('../itemcontainer');
import Topic = require('../topic');

export class Main implements Topic.Communicator {
	public childrenReceived = new Evt.EventImpl<Topic.ChildrenReceivedArgs>();
	
	public setTestChildren(id: number, children: Topic.Model[]) {
		this.testTopics.set(id, children);
	}
	
	public queryChildren(id: number) {
		try {
			var children = this.testTopics.get(id);
			this.childrenReceived.raise({ id: id, children: children });
		}
		catch(e) {
			//TODO
		}
	}
	
	private testTopics = new ItemContainer.Main<Topic.Model[]>();
}

export class Stub implements Topic.Communicator {
	public childrenReceived = new Evt.EventImpl<Topic.ChildrenReceivedArgs>();
	
	public queryChildren(id: number): void {
	}
}