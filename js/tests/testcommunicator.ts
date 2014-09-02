import Communicator = require('../communicator')
import TestKokiCommunicator = require('tests/testkonsenskistecommunicator')

class TestCommunicator implements Communicator.Main {
	public konsenskiste = new TestKokiCommunicator;
}

export = TestCommunicator;