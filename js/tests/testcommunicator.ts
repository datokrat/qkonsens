import Communicator = require('../communicator')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')
import TopicCommunicator = require('tests/testtopiccommunicator');

class TestCommunicator implements Communicator.Main {
	public konsenskiste = new KokiCommunicator.Main;
	public topic = new TopicCommunicator.Main();
}

export = TestCommunicator;