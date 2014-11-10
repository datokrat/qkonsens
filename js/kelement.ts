//KElement = parent of Ka and Koki
import Obs = require('observable');
import ContentModel = require('contentmodel');
import ContentViewModel = require('contentviewmodel');
import Rating = require('rating');
import Discussion = require('discussion');

export class Model {
	public id: Obs.Observable<number> = ko.observable<number>();
	public general: Obs.Observable<ContentModel.General> = ko.observable<ContentModel.General>( new ContentModel.General );
	public context: Obs.Observable<ContentModel.Context> = ko.observable<ContentModel.Context>( new ContentModel.Context );
	public rating: Obs.Observable<Rating.Model> = ko.observable<Rating.Model>( new Rating.Model );
	public discussion: Obs.Observable<Discussion.Model> = ko.observable<Discussion.Model>( new Discussion.Model );
	
	public set(model: Model) {
		this.id(model.id());
		this.general().set(model.general());
		this.context().set(model.context());
		this.rating().set(model.rating());
		this.discussion(model.discussion());
	}
}

export class ViewModel {
	public general: Obs.Observable<ContentViewModel.General>;
	public context: Obs.Observable<ContentViewModel.Context>;
	public rating: Obs.Observable<Rating.ViewModel>;
	public discussion: Obs.Observable<Discussion.ViewModel>;
}

/*export class Controller {
	constructor(model, viewModel, communicator) {
		this.initDiscussion();
		this.initGeneralContent();
		this.initContext();
		this.initRating();
	}
}*/