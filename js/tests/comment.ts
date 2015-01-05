import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');

import Comment = require('../comment');
import Rating = require('../rating');
import RatingCommunicator = require('tests/testratingcommunicator');
import DiscussionCommunicator = require('tests/testdiscussioncommunicator');

export class Main extends unit.TestClass {
	test() {
		var counter = new common.Counter();
		var model = new Comment.Model();
		var viewModel = new Comment.ViewModel();
		var communicator = new DiscussionCommunicator();
		communicator.rating = new RatingCommunicator.Stub();
		var controller = new Comment.Controller(model, viewModel, communicator);
		
		communicator.rating.submitLikeRating = (ratableId: number, rating: string, then: () => void) => {
			test.assert(v => v.val(rating) == 'like');
			then();
		};
		
		controller.commandProcessor.processCommand(new Rating.SelectLikeRatingCommand('like', () => {
			counter.inc('command');
		}));
		
		test.assert(v => v.val(counter.get('command')) == 1);
	}
}