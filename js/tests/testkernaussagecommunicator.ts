import Events = require('../event')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import TestDiscussionCommunicator = require('tests/testdiscussioncommunicator')
import ContentCommunicator = require('../contentcommunicator')
import KaCommunicator = require('../kernaussagecommunicator')

import KernaussageModel = require('kernaussagemodel')

class TestKaCommunicator implements KaCommunicator.Main {
	public content: ContentCommunicator.Main;
	
	private testItems = ko.observable({});
	public discussion = new TestDiscussionCommunicator(this.testItems);
	
	public received = new Events.EventImpl<KaCommunicator.ReceivedArgs>();
	
	constructor(cxt: { content: ContentCommunicator.Main } = { content: new TestContentCommunicator }) {
		this.content = cxt.content;
	}

	public setTestKa(ka: KernaussageModel.Model) {
		if(typeof ka.id() === 'number') {
			this.testItems()[ka.id()] = ka;
		}
		else throw new Error('TestKaCommunicator.setTestKa: ka.id is not a number');
	}
	
	public query(id: number) {
		throw new Error('not implemented');
	}
}

export = TestKaCommunicator;