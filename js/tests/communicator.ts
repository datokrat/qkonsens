import unit = require('tests/asyncunit')
import test = require('tests/test')

import MContentCommunicator = require('../contentcommunicator')
import ContentCommunicatorImpl = require('tests/testcontentcommunicator')

class TestClass extends unit.TestClass {
	private com: MContentCommunicator.Main;

	setUp() {
		com = new ContentCommunicatorImpl;
	}
	
	queryContent(cxt, r) {
	}
}