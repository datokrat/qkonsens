import Evt = require('event');
import Topic = require('topic');
import discoContext = require('discocontext');

export class Main implements Topic.Communicator {
	public childrenReceived: Evt.Event<Topic.ChildrenReceivedArgs> = new Evt.EventImpl<Topic.ChildrenReceivedArgs>();
	public containedKokisReceived = new Evt.EventImpl<Topic.ContainedKokisReceivedArgs>();
	
	public queryChildren(id: Topic.TopicIdentifier): void {
		if(id.root) this.queryRootChildren();
		else this.queryNonRootChildren(id.id);
	}
	
	private queryRootChildren(): void {
		var parentlessFilter = discoContext.PostReferences.filter(function(it) { return it.ReferenceType.Description.Name != 'Child'});
		
		discoContext.Posts.filter(
			function(it) { return it.PostType.Description.Name == 'Topic' && it.RefersTo.every(this.parentlessFilter) },
			{ parentlessFilter: parentlessFilter })
			.include('Content')
			.toArray()
			.then(topics => {
				var rootChildren = topics.map(raw => this.parser.parseTopic(raw));
				this.childrenReceived.raise({ id: { root: true, id: undefined }, children: rootChildren });
			});
	}
	
	private queryNonRootChildren(id: number): void {
		var childFilter = discoContext.PostReferences.filter(
			function(it) { return it.ReferenceType.Description.Name == 'Child' && it.ReferreeId == this.Id },
			{ Id: id });
		
		discoContext.Posts.filter(
			function(it) { return it.PostType.Description.Name == 'Topic' && it.RefersTo.some(this.childFilter) },
			{ childFilter: childFilter })
			.include('Content')
			.toArray().then(topics => {
				var rootChildren = topics.map(raw => this.parser.parseTopic(raw));
				this.childrenReceived.raise({ id: { id: id }, children: rootChildren });
			});
	}
	
	public queryContainedKokis(id: Topic.TopicIdentifier) {
	}
	
	private parser = new Parser();
}

export class Parser {
	public parseTopic(discoTopic: Disco.Ontology.Post): Topic.Model {
		var topic = new Topic.Model();
		topic.id = { id: parseInt(discoTopic.Id) };
		topic.title(discoTopic.Content.Title);
		topic.text(discoTopic.Content.Text);
		return topic;
	}
}