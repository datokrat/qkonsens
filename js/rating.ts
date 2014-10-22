import Obs = require('observable');
import RatingCommunicator = require('ratingcommunicator');

export interface RatableModel {
	id: Obs.Observable<number>;
	rating: Obs.Observable<Model>;
}

export class Model {
	public personalRating: Obs.Observable<string> = ko.observable<string>('none');
}

export class ViewModel {
	public id: number;
	public personalRating: Obs.Observable<string>;
	public summarizedRatings: Obs.Observable<SummarizedRatingCollection>;
	
	public select: (rating: string) => () => void;
}

export class Controller {
	private static idCtr = 0;
	
	constructor(model: Model, viewModel: ViewModel, communicator: RatingCommunicator.Base) {
		viewModel.id = Controller.idCtr++;
		viewModel.personalRating = model.personalRating;
		
		viewModel.summarizedRatings = ko.observable({
			stronglike: ko.observable(0), like: ko.observable(0), neutral: ko.observable(0), 
			dislike: ko.observable(0), strongdislike: ko.observable(0)
		});
		
		viewModel.select = (rating: string) => () => setTimeout(() =>{
			viewModel.personalRating(rating);
		});
	}
	
	public dispose() {
	}
}

export class SummarizedRatingCollection {
	public stronglike: Obs.Observable<number>;
	public like: Obs.Observable<number>;
	public neutral: Obs.Observable<number>;
	public dislike: Obs.Observable<number>;
	public strongdislike: Obs.Observable<number>;
}