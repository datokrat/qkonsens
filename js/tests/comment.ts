import unit = require('tests/tsunit');
import test = require('tests/test');

import Comment = require('../comment');
import Rating = require('../rating');
import DiscussionCommunicator = require('tests/testdiscussioncommunicator');

export class Main extends unit.TestClass {
	test() {
		var model = new Comment.Model();
		var viewModel = new Comment.ViewModel();
		var communicator = new DiscussionCommunicator();
	}
}