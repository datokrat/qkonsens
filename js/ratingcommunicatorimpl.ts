import RatingCommunicator = require('ratingcommunicator');
import Events = require('event');
import Rating = require('rating');
import discoContext = require('discocontext');
import disco = require('disco');
import common = require('common');
import Obs = require('observable');

export class Main implements RatingCommunicator.Base {
	public submitRating(ratableId: number, rating: string, then?: () => void): void {
		var onSuccess = () => {
			then && then();
			this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
		};
		var onError = err => {
			this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: err });
		};
		
		if(rating != 'none') {
			this.submitDiscoRating(ratableId, ScoreParser.fromRatingToDisco(rating), { then: onSuccess, fail: onError });
		}
		else {
			onError(new Error('rating deletion not implemented'));
		}
	}
	public submitLikeRating(ratableId: number, rating: string, then?: () => void): void {
		var onSuccess = () => {
			then && then();
			//this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
		};
		var onError = err => {
			//this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: err });
		};
		
		if(rating != 'none') {
			this.submitDiscoRating(ratableId, ScoreParser.fromLikeRatingToDisco(rating), { then: onSuccess, fail: onError });
		}
		else {
			onError(new Error('rating deletion not implemented'));
		}
	}
	
	private submitDiscoRating(ratableId: number, score: number, callbacks: { then?: () => void; fail?: (err) => void } = {}): void {
		var ratings: Disco.Ontology.Rating[];
		var discoRating: Disco.Ontology.Rating;
		var userName = disco.AuthData().user;
		common.Callbacks.batch([
			r => {
				discoContext.Ratings.filter(function(it) {
					return it.ModifiedBy.Author.Alias == this.userName && it.PostId == this.ratableId.toString() }, 
						{ userName: userName, ratableId: ratableId })
				.toArray().then(results => { ratings = results; r() });
			},
			r => {
				if(ratings.length == 0) {
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
				discoRating.Score = score;
				discoRating.UserId = '12';
				discoContext.saveChanges()
					.then(r)
					.fail(args => callbacks.fail && callbacks.fail(args));
			}
		], () => {
			callbacks.then && callbacks.then();
		});
	}
	public queryRating(ratableId: number): void {}
	
	public ratingSubmitted: Events.Event<RatingCommunicator.SubmittedArgs> = new Events.EventImpl<RatingCommunicator.SubmittedArgs>();
	public ratingReceived: Events.Event<RatingCommunicator.ReceivedArgs> = new Events.EventImpl<RatingCommunicator.ReceivedArgs>();
	
	public ratingSubmissionFailed: Events.Event<RatingCommunicator.SubmissionFailedArgs> = new Events.EventImpl<RatingCommunicator.SubmissionFailedArgs>();
}

export class Parser {
	public parse(rawRatings: Disco.Ontology.Rating[], out?: Rating.Model): Rating.Model {
		var userName = disco.AuthData().user;
		out = out || new Rating.Model();
		out.personalRating('none');
		rawRatings.forEach(rawRating => {
			var ratingValue = ScoreParser.fromDisco(rawRating.Score);
			if(rawRating.ModifiedBy.Author.Alias == userName) {
				out.personalRating(ratingValue);
			}
			var summaryObservable: Obs.Observable<number> = out.summarizedRatings()[ratingValue];
			summaryObservable(summaryObservable() ? summaryObservable()+1 : 1);
		});
		return out;
	}
	
	public parseLikeRating(rawRatings: Disco.Ontology.Rating[], out?: Rating.LikeRatingModel): Rating.LikeRatingModel {
		var rating = this.parse(rawRatings);
		out = out || new Rating.LikeRatingModel();
		out.personalRating(ScoreParser.fromRatingToLikeRating(rating.personalRating()));
		return out;
	}
}

export class ScoreParser {
	public static fromRatingToDisco(qkRating: string): number {
		var index = ScoreParser.strings.indexOf(qkRating);
		if(index >= 0) return (index - 2) * 3;
		return null;
	}
	public static fromLikeRatingToDisco(qkRating: string): number {
		return ScoreParser.fromRatingToDisco(qkRating);
	}
	
	public static fromRatingToLikeRating(rating: string): string {
		if(rating == 'like' || rating == 'stronglike')
			return 'like';
		else if(rating == 'dislike' || rating == 'strongdislike')
			return 'dislike';
		else return rating;
	}
	
	public static fromDisco(discoRating: number): string {
		if(discoRating != null) return ScoreParser.strings[Math.round(discoRating/3)+2];
		else return 'none';
	}
	
	private static strings = ['strongdislike', 'dislike', 'neutral', 'like', 'stronglike'];
}