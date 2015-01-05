import Events = require('event');
import Rating = require('rating');
import common = require('common');
import Obs = require('observable');

export interface Base {
	submitRating(ratableId: number, rating: string, then?: () => void): void;
	submitLikeRating(ratableId: number, rating: string, then?: () => void): void;
	queryRating(ratableId: number): void;
	
	ratingSubmitted: Events.Event<SubmittedArgs>;
	ratingReceived: Events.Event<ReceivedArgs>;
	
	ratingSubmissionFailed: Events.Event<SubmissionFailedArgs>;
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