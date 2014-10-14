import Events = require('event');
import Rating = require('rating');

export interface Base {
	submitRating(ratableId: number, rating: string): void;
	queryRating(ratableId: number): void;
	
	ratingSubmitted: Events.Event<SubmittedArgs>;
	ratingReceived: Events.Event<ReceivedArgs>;
	
	submissionFailed: Events.Event<SubmissionFailedArgs>;
}

export class Main implements Base {
	public submitRating(ratableId: number, rating: string): void {}
	public queryRating(ratableId: number): void {}
	
	public ratingSubmitted: Events.Event<SubmittedArgs>;
	public ratingReceived: Events.Event<ReceivedArgs>;
	
	public submissionFailed: Events.Event<SubmissionFailedArgs>;
}

export interface ReceivedArgs {
	ratableId: number;
	rating: Rating.Model;
}

export interface SubmittedArgs {
	ratableId: number;
	rating: string;
}

export interface SubmissionFailedArgs {
	error: Error;
	ratableId: number;
}