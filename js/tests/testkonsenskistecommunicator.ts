import Events = require('event')
import ItemContainer = require('itemcontainer')

import KokiCommunicator = require('../konsenskistecommunicator')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import TestKaCommunicator = require('tests/testkernaussagecommunicator')
import TestDiscussionCommunicator = require('tests/testdiscussioncommunicator')
import TestRatingCommunicator = require('tests/testratingcommunicator');

import KokiModel = require('../konsenskistemodel')


class TestKokiCommunicator implements KokiCommunicator.Main {
	public content: TestContentCommunicator;
	public kernaussage: TestKaCommunicator;
	
	public received = new Events.EventImpl<KokiCommunicator.ReceivedArgs>();
	
	private testItems = new ItemContainer.Main<KokiModel.Model>();
	public discussion = new TestDiscussionCommunicator(this.testItems);
	public rating = new TestRatingCommunicator.Main(this.testItems);
	
	constructor() {
		this.content = new TestContentCommunicator();
		this.kernaussage = new TestKaCommunicator({ content: this.content });
	}
	
	public setTestKoki(koki: KokiModel.Model) {
		if(typeof koki.id() === 'number') {
			this.testItems.set(koki.id(), koki);
		}
		else throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
	}
	
	public queryKoki(id: number) {
		try {
			var koki = this.testItems.get(id);
		}
		catch(e) {
			throw new Error('TestKokiCommunicator.queryKoki: id not found');
			return;
		}
		this.received.raise({ id: id, konsenskiste: koki });
	}
}

export = TestKokiCommunicator;