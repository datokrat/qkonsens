import Events = require('event')

import KokiCommunicator = require('../konsenskistecommunicator')
import TestContentCommunicator = require('tests/testcontentcommunicator')

import KokiModel = require('../konsenskistemodel')


class TestKokiCommunicator implements KokiCommunicator.Main {
	public content = new TestContentCommunicator;
	
	public received = new Events.EventImpl<KokiCommunicator.ReceivedArgs>();
	
	private testKokis: any = {};
	
	public setTestKoki(koki: KokiModel.Model) {
		if(typeof koki.id === 'number') {
			this.testKokis[koki.id] = koki;
		}
		else throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
	}
	
	public queryKoki(id: number) {
		var koki = this.testKokis[id];
		if(typeof koki !== 'undefined') {
			this.received.raise({ id: id, konsenskiste: koki });
		}
		else throw new Error('TestKokiCommunicator.queryKoki: id not found');
	}
}

export = TestKokiCommunicator;