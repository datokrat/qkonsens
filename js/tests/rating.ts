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
		/*var serverRatableModel = { id: ko.observable(2), rating: ko.observable(new Rating.Model) };
		ctr.setRatableModel({ id: ko.observable(2), rating: ko.observable(mdl) });
		
		var submissionCtr = 0, errorCtr = 0;
		com.ratingSubmitted.subscribe(() => ++submissionCtr);
		com.submissionFailed.subscribe(() => ++errorCtr);
		
		com.setTestRatable(serverRatableModel);
		
		vm.select('like')();
		
		setTimeout(() => {
			try {
				test.assert(() => submissionCtr == 1);
				test.assert(() => errorCtr == 0);
				test.assert(() => serverRatableModel.rating().personalRating() == 'like');
			r();
			}
			catch(e) {
				r(e);
			}
		}, 100);*/
	}
	
	/*queryRating() {
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: null });
		ctr.setRatableModel({ id: ko.observable(2), rating: ko.observable(mdl) });
		
		var successCtr = 0;
		
		var serverRatableModel = { id: ko.observable(2), rating: ko.observable(new Rating.Model) };
		serverRatableModel.rating().personalRating('stronglike');
		com.setTestRatable(serverRatableModel);
		com.ratingReceived.subscribe(args => {
			++successCtr;
			test.assert(() => args.ratableId == 2);
			test.assert(() => args.rating.personalRating() == 'stronglike');
		});
		
		com.queryRating(2);
		
		test.assert(() => successCtr == 1);
		test.assert(() => mdl.personalRating() == 'stronglike');
	}*/
	
	summarizedRatingsMVSync() {
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: null });
		
		mdl.summarizedRatings().like(3);
		
		test.assert(() => vm.summarizedRatings().like() == 3);
	}
}