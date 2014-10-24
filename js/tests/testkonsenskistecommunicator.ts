import Events = require('event');
import ItemContainer = require('itemcontainer');

import KokiCommunicator = require('../konsenskistecommunicator');
import TestContentCommunicator = require('tests/testcontentcommunicator');
import TestKaCommunicator = require('tests/testkernaussagecommunicator');
import TestDiscussionCommunicator = require('tests/testdiscussioncommunicator');
import TestRatingCommunicator = require('tests/testratingcommunicator');

import KonsenskisteModel = require('../konsenskistemodel');
import KernaussageModel = require('../kernaussagemodel');


class TestKokiCommunicator implements KokiCommunicator.Main {
	public content: TestContentCommunicator;
	public kernaussage: TestKaCommunicator;
	
	public received = new Events.EventImpl<KokiCommunicator.ReceivedArgs>();
	public kernaussageAppended = new Events.EventImpl<KokiCommunicator.KaAppendedArgs>();
	
	private testItems = new ItemContainer.Main<KonsenskisteModel.Model>();
	public discussion = new TestDiscussionCommunicator(this.testItems);
	public rating = new TestRatingCommunicator.Main(this.testItems);
	
	constructor() {
		this.content = new TestContentCommunicator();
		this.kernaussage = new TestKaCommunicator({ content: this.content });
	}
	
	public setTestKoki(koki: KonsenskisteModel.Model) {
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
	
	public createAndAppendKa(kokiId: number, ka: KernaussageModel.Model) {
		var koki = this.testItems.get(kokiId);
		koki.childKas.push(ka);
		this.kernaussageAppended.raise({ konsenskisteId: kokiId, kernaussage: ka });
	}
}

export = TestKokiCommunicator;