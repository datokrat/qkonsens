import unit = require('tests/tsunit');
import test = require('tests/test');

import RatingCommunicator = require('tests/testratingcommunicator');

class TestClass extends unit.TestClass {
	test() {
		var com = new RatingCommunicator();
	}
}

export = TestClass;