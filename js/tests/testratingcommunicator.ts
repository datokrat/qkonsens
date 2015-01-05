import Obs = require('../observable');
import Events = require('../event');
import ItemContainer = require('../itemcontainer');
import RatingCommunicator = require('../ratingcommunicator');
import Rating = require('../rating');



export class Stub implements RatingCommunicator.Base {
	public submitRating(ratableId: number, rating: string): void {}
	public submitLikeRating(ratableId: number, rating: string): void {}
	
	public queryRating(ratableId: number): void {}
	
	public ratingSubmitted: Events.Event<RatingCommunicator.SubmittedArgs> = new Events.EventImpl<RatingCommunicator.SubmittedArgs>();
	public ratingReceived: Events.Event<RatingCommunicator.ReceivedArgs> = new Events.EventImpl<RatingCommunicator.ReceivedArgs>();
	
	public ratingSubmissionFailed: Events.Event<RatingCommunicator.SubmissionFailedArgs> = new Events.EventImpl<RatingCommunicator.SubmissionFailedArgs>();
}

export class Main implements RatingCommunicator.Base {
	constructor(
		private testItems: ItemContainer.Base<Rating.RatableModel> = new ItemContainer.Main<Rating.RatableModel>(),
		private testLikeRatingItems: ItemContainer.Base<Rating.LikeRatableModel> = new ItemContainer.Main<Rating.LikeRatableModel>()) {
	}
	
	public ratingSubmitted = new Events.EventImpl<RatingCommunicator.SubmittedArgs>();
	public ratingReceived = new Events.EventImpl<RatingCommunicator.ReceivedArgs>();
	public ratingSubmissionFailed = new Events.EventImpl<RatingCommunicator.SubmissionFailedArgs>();
	
	public submitRating(ratableId: number, rating: string, then?: () => void): void {
		try {
			var ratable = this.testItems.get(ratableId);
			ratable.rating().personalRating(rating);
		}
		catch(e) {
			var error = new Error('could not submit rating.');
			error['innerError'] = e;
			this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: error});
			return;
		}
		then && then();
		this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
	}
	public submitLikeRating(ratableId: number, rating: string, then?: () => void): void {
		try {
			var ratable = this.testLikeRatingItems.get(ratableId);
			ratable.rating().personalRating(rating);
		}
		catch(e) {
			var error = new Error('could not submit rating.');
			error['innerError'] = e;
			//this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: error});
			return;
		}
		then && then();
		//this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
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