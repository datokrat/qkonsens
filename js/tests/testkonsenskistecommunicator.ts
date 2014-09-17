import Events = require('event')

import KokiCommunicator = require('../konsenskistecommunicator')
import TestContentCommunicator = require('tests/testcontentcommunicator')


class TestKokiCommunicator implements KokiCommunicator.Main {
	public content = new TestContentCommunicator;
	
	public received = new Events.EventImpl<KokiCommunicator.ReceivedArgs>();
}

export = TestKokiCommunicator;