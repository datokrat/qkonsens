import KokiCommunicator = require('../konsenskistecommunicator')
import TestContentCommunicator = require('tests/testcontentcommunicator')

class TestKokiCommunicator implements KokiCommunicator.Main {
	public content = new TestContentCommunicator;
}

export = TestKokiCommunicator;