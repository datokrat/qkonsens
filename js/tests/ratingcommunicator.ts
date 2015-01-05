import unit = require('tests/tsunit');
import test = require('tests/test');

import TestRatingCommunicator = require('tests/testratingcommunicator');
import RatingCommunicator = require('../ratingcommunicator');
import Rating = require('../rating');

class TestClass extends unit.TestClass {
	rateNonexistentRatable() {
		var com = new TestRatingCommunicator.Main();
		var ctr = 0;
		
		com.ratingSubmissionFailed.subscribe((args: RatingCommunicator.SubmissionFailedArgs) => {
			test.assert( () => args.ratableId == 2 );
			++ctr;
		});
		
		com.submitRating(2, 'stronglike');
		test.assert( () => ctr == 1 );
	}
	
	submitRatingAndReceiveNewValue() {
		var ctr = 0;
		var com = new TestRatingCommunicator.Main();
		com.setTestRatable({ id: ko.observable(2), rating: ko.observable(new Rating.Model) });
		
		com.ratingSubmitted.subscribe((args: RatingCommunicator.SubmittedArgs) => {
			test.assert( () => args.ratableId == 2 );
			test.assert( () => args.rating == 'stronglike' );
			++ctr;
		});
		com.submitRating(2, 'stronglike');
		
		test.assert( () => ctr == 1 );
	}
	
	queryRating() {
		var ctr = 0;
		var com = new TestRatingCommunicator.Main();
		var rating = new Rating.Model();
		rating.personalRating('like');
		com.setTestRatable({ id: ko.observable(10), rating: ko.observable(rating) });
		
		com.ratingReceived.subscribe((args: RatingCommunicator.ReceivedArgs) => {
			++ctr;
			test.assert( () => args.ratableId == 10 );
			test.assert( () => args.rating.personalRating() == 'like' );
		});
		
		com.queryRating(10);
		
		test.assert( () => ctr == 1 );
	}
	
	/*submitAndReceiveRating() {
		var ctr = 0;
		var com = new TestRatingCommunicator.Main();
		com.setTestRatable({ id: ko.observable(42), rating: ko.observable(new Rating.Model) });
		
		com.ratingReceived.subscribe((args: RatingCommunicator.ReceivedArgs) => {
			++ctr;
			test.assert( () => args.ratableId == 42 );
			test.assert( () => args.rating.personalRating() == 'dislike' );
		});
		
		com.submitRating(42, 'dislike');
		
		test.assert( () => ctr == 1 );
	}*/
}

export = TestClass;