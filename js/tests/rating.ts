import unit = require('tests/asyncunit');
import test = require('tests/test');

import Rating = require('../rating');
import RatingCommunicator = require('tests/testratingcommunicator');

export class TestClass extends unit.TestClass {
	submitRating(cxt, r) {
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
}