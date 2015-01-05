import RatingCommunicator = require('ratingcommunicator');
import Events = require('event');
import Rating = require('rating');
import discoContext = require('discocontext');
import common = require('common');
import Obs = require('observable');

export class Main implements RatingCommunicator.Base {
	public submitRating(ratableId: number, rating: string, then?: () => void): void {
		var ratings: Disco.Ontology.Rating[];
		var discoRating: Disco.Ontology.Rating;
		common.Callbacks.batch([
			r => {
				discoContext.Ratings.filter(function(it) {
					return it.ModifiedBy.AuthorId == '12' && it.PostId == this.ratableId.toString() }, { ratableId: ratableId })
				.toArray().then(results => { ratings = results; r() });
			},
			r => {
				if(ratings.length == 0 && rating != 'none') {
					discoRating = new Disco.Ontology.Rating({ PostId: ratableId.toString() });
					discoContext.Ratings.add(discoRating);
				}
				if(ratings.length > 1) 
					console.warn('More than one Rating was found for Ratable #' + ratableId);
				if(ratings.length >= 1) {
					discoRating = ratings[0];
					discoContext.Ratings.attach(discoRating);
				}
				r();
			},
			r => {
				if(rating != 'none') {
					discoRating.Score = ScoreParser.toDisco(rating);
					discoRating.UserId = '12';
					discoContext.saveChanges()
						.then(r)
						.fail(args => this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: args }));
				}
				else if(discoRating) {
					//discoContext.Ratings.remove(discoRating);
					this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: new Error('rating deletion not implemented') });
					r();
				}
				else {
					r();
				}
			}
		], () => {
			then && then();
			this.ratingSubmitted.raise({ ratableId: ratableId, rating: ScoreParser.fromDisco(discoRating.Score) });
		});
	}
	public submitLikeRating(ratableId: number, rating: string, then?: () => void): void {
		throw new Error('not implemented');
	}
	public queryRating(ratableId: number): void {}
	
	public ratingSubmitted: Events.Event<RatingCommunicator.SubmittedArgs> = new Events.EventImpl<RatingCommunicator.SubmittedArgs>();
	public ratingReceived: Events.Event<RatingCommunicator.ReceivedArgs> = new Events.EventImpl<RatingCommunicator.ReceivedArgs>();
	
	public ratingSubmissionFailed: Events.Event<RatingCommunicator.SubmissionFailedArgs> = new Events.EventImpl<RatingCommunicator.SubmissionFailedArgs>();
}

export class Parser {
	public parse(rawRatings: Disco.Ontology.Rating[], out?: Rating.Model): Rating.Model {
		out = out || new Rating.Model();
		out.personalRating('none');
		rawRatings.forEach(rawRating => {
			var ratingValue = ScoreParser.fromDisco(rawRating.Score);
			if(rawRating.ModifiedBy.AuthorId == '12') {
				out.personalRating(ratingValue);
			}
			var summaryObservable: Obs.Observable<number> = out.summarizedRatings()[ratingValue];
			summaryObservable(summaryObservable() ? summaryObservable()+1 : 1);
		});
		return out;
	}
}

export class ScoreParser {
	public static toDisco(qkRating: string): number {
		var index = ScoreParser.strings.indexOf(qkRating);
		if(index >= 0) return (index - 2) * 3;
		return null;
	}
	
	public static fromDisco(discoRating: number): string {
		if(discoRating != null) return ScoreParser.strings[Math.round(discoRating/3)+2];
		else return 'none';
	}
	
	private static strings = ['strongdislike', 'dislike', 'neutral', 'like', 'stronglike'];
}