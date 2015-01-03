import unit = require('tests/asyncunit');
import test = require('tests/test');

import Rating = require('../rating');
import RatingCommunicator = require('tests/testratingcommunicator');

export class TestClass extends unit.TestClass {
	submitRating(async, r) {
		async();
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var ctr = new Rating.Controller(mdl, vm, com);
		var serverRatableModel = { id: ko.observable(2), rating: ko.observable(new Rating.Model) };
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
		}, 100);
	}
	
	queryRating(async, r) {
		async();
		var mdl = new Rating.Model();
		var vm = new Rating.ViewModel();
		var com = new RatingCommunicator.Main();
		var ctr = new Rating.Controller(mdl, vm, com);
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
		r();
	}
}