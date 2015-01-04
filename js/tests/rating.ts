import unit = require('tests/asyncunit');
import test = require('tests/test');
import common = require('../common');
import Commands = require('../command');

import Rating = require('../rating');
import RatingCommunicatorBase = require('../ratingcommunicator');
import RatingCommunicator = require('tests/testratingcommunicator');

export class TestClass extends unit.TestClass {
	submitRating(async, r) {
		async();
		var counter = new common.Counter();
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var commandProcessor = new Commands.CommandProcessor();
		var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: commandProcessor });
		
		commandProcessor.chain.append(cmd => {
			counter.inc('command');
			test.assert(() => cmd instanceof Rating.SelectRatingCommand);
			
			var castCmd = <Rating.SelectRatingCommand>cmd;
			test.assert(() => castCmd.ratingValue == 'like');
			
			castCmd.then();
			test.assert(() => mdl.personalRating() == 'like');
			return true;
		});
		
		vm.select('like')();
		
		setTimeout(() => {
			test.assert(() => counter.get('command') == 1);
			r();
		});
	}
	
	summarizedRatingsMVSync() {
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: null });
		
		mdl.summarizedRatings().like(3);
		
		test.assert(() => vm.summarizedRatings().like() == 3);
	}
}