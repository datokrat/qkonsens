import Evt = require('../event');
import ItemContainer = require('../itemcontainer');
import Topic = require('../topic');

export class Main implements Topic.Communicator {
	public childrenReceived = new Evt.EventImpl<Topic.ChildrenReceivedArgs>();
	public containedKokisReceived = new Evt.EventImpl<Topic.ContainedKokisReceivedArgs>();
	
	public setTestChildren(id: Topic.TopicIdentifier, children: Topic.Model[]) {
		if(id.root)
			this.testRootTopic = children;
		else
			this.testTopics.set(id.id, children);
	}
	
	public queryChildren(id: Topic.TopicIdentifier) {
		try {
			if(id.root)
				this.childrenReceived.raise({ id: id, children: this.testRootTopic });
			var children = this.testTopics.get(id.id);
			this.childrenReceived.raise({ id: id, children: children });
		}
		catch(e) {
			//TODO
		}
	}
	
	public queryContainedKokis(id: Topic.TopicIdentifier) {
	}
	
	private testTopics = new ItemContainer.Main<Topic.Model[]>();
	private testRootTopic: Topic.Model[] = [];
}

export class Stub implements Topic.Communicator {
	public childrenReceived = new Evt.EventImpl<Topic.ChildrenReceivedArgs>();
	public containedKokisReceived = new Evt.EventImpl<Topic.ContainedKokisReceivedArgs>();
	
	public queryChildren(id: Topic.TopicIdentifier): void {}
	public queryContainedKokis(id: Topic.TopicIdentifier): void {}
}