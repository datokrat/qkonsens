import unit = require('tests/asyncunit');
import test = require('tests/test');
import common = require('../common');
import Commands = require('../command');

import Rating = require('../rating');
import RatingCommunicatorBase = require('../ratingcommunicator');
import RatingCommunicator = require('tests/testratingcommunicator');

export class TestClass extends unit.TestClass {
	submitRating(async, r, cb) {
		async();
		var counter = new common.Counter();
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var commandProcessor = new Commands.CommandProcessor();
		var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: commandProcessor });
		
		commandProcessor.chain.append(cb(cmd => {
			counter.inc('command');
			test.assert(() => cmd instanceof Rating.SelectRatingCommand);
			
			var castCmd = <Rating.SelectRatingCommand>cmd;
			test.assert(() => castCmd.ratingValue == 'like');
			
			castCmd.then();
			test.assert(() => mdl.personalRating() == 'like');
			return true;
		}));
		
		vm.select('like')();
		
		setTimeout(cb(() => {
			test.assert(() => counter.get('command') == 1);
			r();
		}));
	}
	
	submitLikeRating(async, r, cb) {
		async();
		var counter = new common.Counter();
		var mdl = new Rating.LikeRatingModel();
		var vm = new Rating.LikeRatingViewModel();
		var commandProcessor = new Commands.CommandProcessor();
		var ctr = new Rating.LikeRatingController(mdl, vm, commandProcessor);
		
		commandProcessor.chain.append(cb(cmd => {
			counter.inc('command');
			test.assert(v => cmd instanceof Rating.SelectLikeRatingCommand);
			var typedCmd = <Rating.SelectLikeRatingCommand>cmd;
			test.assert(v => typedCmd.ratingValue == 'dislike');
			typedCmd.then && typedCmd.then();
			test.assert(v => v.val(mdl.personalRating()) == 'dislike');
			return true;
		}));
		vm.select('dislike')();
		setTimeout(cb(() => {
			test.assert(() => counter.get('command') == 1);
			r();
		}));
	}
	
	summarizedRatingsMVSync() {
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: null });
		
		mdl.summarizedRatings().like(3);
		
		test.assert(() => vm.summarizedRatings().like() == 3);
	}
	
	summarizedLikeRatingsMVSync() {
		var mdl = new Rating.LikeRatingModel();
		var vm = new Rating.LikeRatingViewModel();
		var com = new RatingCommunicator.Stub();
		var ctr = new Rating.LikeRatingController(mdl, vm, null);
		
		mdl.summarizedRatings().like(6);
		
		test.assert(v => vm.summarizedRatings().like() == 6);
	}
}