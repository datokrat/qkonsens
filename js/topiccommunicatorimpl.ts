import Evt = require('event');
import Topic = require('topic');
import TopicNavigation = require('topicnavigationmodel');
import KokiCommunicator = require('konsenskistecommunicatorimpl');
import discoContext = require('discocontext');

export class Main implements Topic.Communicator {
	public childrenReceived: Evt.Event<Topic.ChildrenReceivedArgs> = new Evt.EventImpl<Topic.ChildrenReceivedArgs>();
	public containedKokisReceived = new Evt.EventImpl<Topic.ContainedKokisReceivedArgs>();
	
	public queryChildren(id: Topic.TopicIdentifier, out?: TopicNavigation.Children): void {
		var out = out || new TopicNavigation.Children();
		out.queryState().loading(true);
		
		var then = (rawChildren: Disco.Ontology.Post[]) => {
			var children = rawChildren.map(raw => this.topicParser.parseTopic(raw));
			this.childrenReceived.raise({ id: id, children: children });
			
			out.items.set(children);
			out.queryState().loading(false);
		};
		
		if(id.root) this.queryRootChildren(then);
		else this.queryNonRootChildren(id.id, then);
	}
	
	private queryRootChildren(then: (rawChildren: Disco.Ontology.Post[]) => void): void {
		var parentlessFilter = discoContext.PostReferences.filter(function(it) { return it.ReferenceType.Description.Name != 'Child'});
		
		discoContext.Posts.filter(
			function(it) { return it.PostType.Description.Name == 'Topic' && it.RefersTo.every(this.parentlessFilter) },
			{ parentlessFilter: parentlessFilter })
			.include('Content')
			.toArray()
			.then(then);
	}
	
	private queryNonRootChildren(id: number, then: (rawChildren: Disco.Ontology.Post[]) => void): void {
		var childFilter = discoContext.PostReferences.filter(
			function(it) { return it.ReferenceType.Description.Name == 'Child' && it.ReferreeId == this.Id },
			{ Id: id });
		
		discoContext.Posts.filter(
			function(it) { return it.PostType.Description.Name == 'Topic' && it.RefersTo.some(this.childFilter) },
			{ childFilter: childFilter })
			.include('Content')
			.toArray().then(then);
	}
	
	public queryContainedKokis(id: Topic.TopicIdentifier, out?: TopicNavigation.Kokis) {
		var out = out || new TopicNavigation.Kokis();
		out.queryState().loading(true);
		
		var then = (rawKokis: Disco.Ontology.Post[]) => {
			var kokis = rawKokis.map(raw => this.kokiParser.parse(raw));
			this.containedKokisReceived.raise({ id: id, kokis: kokis });
			
			out.items.set(kokis);
			out.queryState().loading(false);
		};
		
		if(!id.root) this.queryContainedKokisOfNonRoot(id.id, then);
		else then([]);
	}
	
	private queryContainedKokisOfNonRoot(id: number, then: (rawKokis: Disco.Ontology.Post[]) => void) {
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
		.toArray().then(then);
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