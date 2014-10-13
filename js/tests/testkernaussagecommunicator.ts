import Events = require('../event')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import TestDiscussableCommunicator = require('tests/testdiscussablecommunicator')
import ContentCommunicator = require('../contentcommunicator')
import KaCommunicator = require('../kernaussagecommunicator')

import KernaussageModel = require('kernaussagemodel')

class TestKaCommunicator extends TestDiscussableCommunicator implements KaCommunicator.Main {
	public content: ContentCommunicator.Main;
	public received = new Events.EventImpl<KaCommunicator.ReceivedArgs>();
	
	constructor(cxt: { content: ContentCommunicator.Main } = { content: new TestContentCommunicator }) {
		super();
		this.content = cxt.content;
	}

	public setTestKa(ka: KernaussageModel.Model) {
		if(typeof ka.id() === 'number') {
			this.testItems[ka.id()] = ka;
		}
		else throw new Error('TestKaCommunicator.setTestKa: ka.id is not a number');
	}
	
	public query(id: number) {
		throw new Error('not implemented');
	}
}

export = TestKaCommunicator;