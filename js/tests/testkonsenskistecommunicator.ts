import Events = require('event')

import KokiCommunicator = require('../konsenskistecommunicator')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import TestKaCommunicator = require('tests/testkernaussagecommunicator')
import TestDiscussionCommunicator = require('tests/testdiscussioncommunicator')

import KokiModel = require('../konsenskistemodel')


class TestKokiCommunicator implements KokiCommunicator.Main {
	public content: TestContentCommunicator;
	public kernaussage: TestKaCommunicator;
	
	public received = new Events.EventImpl<KokiCommunicator.ReceivedArgs>();
	
	private testItems = ko.observable({});
	public discussion = new TestDiscussionCommunicator(this.testItems);
	
	constructor() {
		this.content = new TestContentCommunicator();
		this.kernaussage = new TestKaCommunicator({ content: this.content });
	}
	
	public setTestKoki(koki: KokiModel.Model) {
		if(typeof koki.id() === 'number') {
			this.testItems()[koki.id()] = koki;
		}
		else throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
	}
	
	public queryKoki(id: number) {
		var koki = this.testItems()[id];
		if(typeof koki !== 'undefined') {
			this.received.raise({ id: id, konsenskiste: koki });
		}
		else throw new Error('TestKokiCommunicator.queryKoki: id not found');
	}
}

export = TestKokiCommunicator;