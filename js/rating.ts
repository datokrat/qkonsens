import Obs = require('observable');
import Evt = require('event');
import RatingCommunicator = require('ratingcommunicator');
import Commands = require('command');

export interface RatableModel {
	id: Obs.Observable<number>;
	rating: Obs.Observable<Model>;
}

export class Model {
	public personalRating: Obs.Observable<string> = ko.observable<string>('none');
	public summarizedRatings: Obs.Observable<SummarizedRatingCollectionModel> = ko.observable(new SummarizedRatingCollectionModel);
	
	public set(other: Model) {
		this.personalRating(other.personalRating());
		this.summarizedRatings().set(other.summarizedRatings());
	}
}

export class LikeRatingModel {
	public personalRating: Obs.Observable<string> = ko.observable<string>('none');
	
	public set(other: LikeRatingModel) {
		this.personalRating(other.personalRating());
	}
}

export class ViewModel {
	public id: number;
	public personalRating: Obs.Observable<string>;
	public summarizedRatings: Obs.Observable<SummarizedRatingCollectionViewModel>;
	
	public select: (rating: string) => () => void;
}

export class LikeRatingViewModel {
	public id: number;
	public personalRating: Obs.Observable<string>;
	public select: (rating: string) => () => void;
}

export class Controller {
	private static idCtr = 0;
	
	constructor(model: Model, viewModel: ViewModel, args: ControllerArgs) {
		this.model = model;
		viewModel.id = Controller.idCtr++;
		viewModel.personalRating = model.personalRating;
		
		viewModel.summarizedRatings = model.summarizedRatings;
		
		viewModel.select = (rating: string) => () => setTimeout(() =>{
			args.commandProcessor.processCommand(new SelectRatingCommand(rating, () => this.onRatingSubmitted(rating)));
		});
	}
	
	private onRatingSubmitted(rating: string) {
		this.model.personalRating(rating);
	}
	
	public setRatableModel(ratableModel: RatableModel) {
		this.ratableModel = ratableModel;
	}
	
	public dispose() {
		this.subscriptions.forEach(s => s.dispose());
	}
	
	private ratableModel: RatableModel;
	private model: Model;
	private subscriptions: Evt.Subscription[] = [];
}

export class LikeRatingController {
	private static idCtr = 0;
	
	constructor(private model: LikeRatingModel, viewModel: LikeRatingViewModel, commandProcessor: Commands.CommandProcessor) {
		viewModel.id = LikeRatingController.idCtr++;
		viewModel.personalRating = model.personalRating;
		
		viewModel.select = (ratingValue: string) => () => setTimeout(() => {
			commandProcessor.processCommand(new SelectLikeRatingCommand(ratingValue, () => this.onRatingSubmitted(ratingValue)));
		});
	}
	
	private onRatingSubmitted(ratingValue: string) {
		this.model.personalRating(ratingValue);
	}
	
	public dispose() {
	}
}

export class SelectLikeRatingCommand extends Commands.Command {
	constructor(public ratingValue: string, public then: () => void) { super() }
}

export interface ControllerArgs {
	communicator: RatingCommunicator.Base; commandProcessor: Commands.CommandProcessor;
}

export class SelectRatingCommand {
	constructor(public ratingValue: string, public then: () => void) {}
}

export class SummarizedRatingCollectionViewModel {
	public stronglike: Obs.Observable<number>;
	public like: Obs.Observable<number>;
	public neutral: Obs.Observable<number>;
	public dislike: Obs.Observable<number>;
	public strongdislike: Obs.Observable<number>;
}

export class SummarizedRatingCollectionModel {
	public stronglike = ko.observable<number>(0);
	public like = ko.observable<number>(0);
	public neutral = ko.observable<number>(0);
	public dislike = ko.observable<number>(0);
	public strongdislike = ko.observable<number>(0);
	public set(rhs: SummarizedRatingCollectionViewModel) {
		this.stronglike(rhs.stronglike());
		this.like(rhs.like());
		this.neutral(rhs.neutral());
		this.dislike(rhs.dislike());
		this.strongdislike(rhs.strongdislike());
	}
}