import Obs = require('../observable');
import Events = require('../event');
import ItemContainer = require('../itemcontainer');
import RatingCommunicator = require('../ratingcommunicator');
import Rating = require('../rating');

export class Main implements RatingCommunicator.Base {
	constructor(private testItems: ItemContainer.Base<Rating.RatableModel> = new ItemContainer.Main<Rating.RatableModel>()) {
	}
	
	public ratingSubmitted = new Events.EventImpl<RatingCommunicator.SubmittedArgs>();
	public ratingReceived = new Events.EventImpl<RatingCommunicator.ReceivedArgs>();
	public submissionFailed = new Events.EventImpl<RatingCommunicator.SubmissionFailedArgs>();
	
	public submitRating(ratableId: number, rating: string): void {
		try {
			var ratable = this.testItems.get(ratableId);
			ratable.rating().personalRating(rating);
		}
		catch(e) {
			var error = new Error('could not submit rating.');
			error['innerError'] = e;
			this.submissionFailed.raise({ ratableId: ratableId, error: error});
			return;
		}
		this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
	}
	
	public queryRating(ratableId: number): void {
		try {
			var ratable = this.testItems.get(ratableId);
		}
		catch(e) {
			return;
		}
		this.ratingReceived.raise({ ratableId: ratableId, rating: ratable.rating() });
	}
	
	public setTestRatable(value: Rating.RatableModel) {
		this.testItems.set(value.id(), value);
	}
}