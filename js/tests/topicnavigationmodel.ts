///<reference path="../../typings/knockout.d.ts" />

import unit = require('tests/tsunit')
import mdl = require('../topicnavigationmodel')
import tpc = require('../topic')

export class Tests extends unit.TestClass {
	private factory = new Factory();
	private topicFactory = new TopicFactory();
	
	testSelectChildTopic() {
		var navi = this.factory.create();
		
		navi.history.push( this.topicFactory.create('root') );
		navi.history.push( this.topicFactory.create('child') );
		
		this.areIdentical(navi.selectedTopic().title(), 'child');
		this.areIdentical(navi.history.get().length, 2);
	}
	
	testGoBackToBreadcrumbTopic() {
		var navi = this.factory.create();
		navi.history.push( this.topicFactory.create('root') );
		navi.history.push( this.topicFactory.create('democracy') );
		
		navi.goBackToBreadcrumbTopic(0);
		
		this.areIdentical(navi.selectedTopic().title(), 'root');
		this.areIdentical(navi.history.get().length, 1);
	}
}

class Factory {
	public create(): mdl.Model {
		return new mdl.ModelImpl();
	}
}

class TopicFactory {
	public create(title: string) {
		var topic = new tpc.Model();
		topic.title(title);
		return topic;
	}
}