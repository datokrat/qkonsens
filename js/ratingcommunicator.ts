import Events = require('event');
import Rating = require('rating');
import discoContext = require('discocontext');
import common = require('common');

export interface Base {
	submitRating(ratableId: number, rating: string): void;
	queryRating(ratableId: number): void;
	
	ratingSubmitted: Events.Event<SubmittedArgs>;
	ratingReceived: Events.Event<ReceivedArgs>;
	
	submissionFailed: Events.Event<SubmissionFailedArgs>;
}

export class Main implements Base {
	public submitRating(ratableId: number, rating: string): void {
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
				}
				r();
			},
			r => {
				if(rating != 'none') {
					discoContext.Ratings.attach(discoRating);
					discoRating.Score = ScoreParser.toDisco(rating);
					discoContext.saveChanges()
						.then(r)
						.fail(args => this.submissionFailed.raise({ ratableId: ratableId, error: args }));
				}
				else if(discoRating) {
					//discoContext.Ratings.remove(discoRating);
					this.submissionFailed.raise({ ratableId: ratableId, error: new Error('rating deletion not implemented') });
					r();
				}
				else {
					r();
				}
			}
		], () => {
			console.log('ratingSubmitted', { ratableId: ratableId, rating: ScoreParser.fromDisco(discoRating.Score) });
			this.ratingSubmitted.raise({ ratableId: ratableId, rating: ScoreParser.fromDisco(discoRating.Score) });
		});
	}
	public queryRating(ratableId: number): void {}
	
	public ratingSubmitted: Events.Event<SubmittedArgs> = new Events.EventImpl<SubmittedArgs>();
	public ratingReceived: Events.Event<ReceivedArgs> = new Events.EventImpl<ReceivedArgs>();
	
	public submissionFailed: Events.Event<SubmissionFailedArgs> = new Events.EventImpl<SubmissionFailedArgs>();
}

export class Parser {
	public parse(rawRatings: Disco.Ontology.Rating[], out?: Rating.Model): Rating.Model {
		out = out || new Rating.Model();
		out.personalRating('none');
		rawRatings.forEach(rawRating => {
			if(rawRating.ModifiedBy.AuthorId == '12') {
				out.personalRating(ScoreParser.fromDisco(rawRating.Score));
			}
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