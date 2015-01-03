import Evt = require('event');
import Topic = require('topic');
import KokiCommunicator = require('konsenskistecommunicatorimpl');
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
				var rootChildren = topics.map(raw => this.topicParser.parseTopic(raw));
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
				var children = topics.map(raw => this.topicParser.parseTopic(raw));
				this.childrenReceived.raise({ id: { id: id }, children: children });
			});
	}
	
	public queryContainedKokis(id: Topic.TopicIdentifier) {
		if(!id.root) this.queryContainedKokisOfNonRoot(id.id);
	}
	
	private queryContainedKokisOfNonRoot(id: number) {
		var dependenceFilter = discoContext.PostReferences.filter(function(it) {
			return it.ReferreeId == this.Id;
		}, { Id: id });
		var kaRefFilter = discoContext.PostReferences.filter(function(it) {
			return it.ReferenceType.Description.Name == 'Part';
		});
		
		discoContext.Posts.filter(function(it) {
			return it.RefersTo.some(this.dependenceFilter) && it.ReferredFrom.some(this.kaRefFilter)
		}, { dependenceFilter: dependenceFilter, kaRefFilter: kaRefFilter })
		.include('Content')
		.toArray().then(rawKokis => {
			var kokis = rawKokis.map(raw => this.kokiParser.parse(raw));
			this.containedKokisReceived.raise({ id: { root: false, id: id }, kokis: kokis });
		});
	}
	
	private topicParser = new Parser();
	private kokiParser = new KokiCommunicator.Parser();
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