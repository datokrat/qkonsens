import Communicator = require('../communicator')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')
import TopicCommunicator = require('tests/testtopiccommunicator');
import Commands = require('command');

class TestCommunicator implements Communicator.Main {
	public konsenskiste = new KokiCommunicator.Main;
	public topic = new TopicCommunicator.Main();
	
	public commandProcessor = new Commands.CommandProcessor();
	
	constructor() {
		this.commandProcessor.chain.append(cmd => true);
	}
}

export = TestCommunicator;