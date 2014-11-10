//KElement = parent of Ka and Koki
import Obs = require('observable');
import Evt = require('event');
import ViewModelContext = require('viewmodelcontext');
import ContentModel = require('contentmodel');
import ContentViewModel = require('contentviewmodel');
import Rating = require('rating');
import Discussion = require('discussion');

import ContentCommunicator = require('contentcommunicator');
import DiscussionCommunicator = require('discussioncommunicator');
import RatingCommunicator = require('ratingcommunicator');

import KSync = require('synchronizers/ksynchronizers');

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

export interface Communicator {
	content: ContentCommunicator.Main;
	discussion: DiscussionCommunicator.Base;
	rating: RatingCommunicator.Base;
	
	received: Evt.Event<ReceivedArgs>;
	//receiptError: Evt.Event<ReceiptErrorArgs>;
	query(id: number, out?: Model): Model;
}

export interface ReceivedArgs {
	id: number;
	konsenskiste: Model;
}

export interface ReceiptErrorArgs {
	id: number;
	message: string;
	konsenskiste: Model;
}

export class Controller<Mdl extends Model, Vm extends ViewModel, Com extends Communicator> {
	constructor(model: Mdl, viewModel: Vm, communicator: Com) {
		this.model = model;
		this.viewModel = viewModel;
		this.communicator = communicator;
		
		this.initDiscussion();
		this.initGeneralContent();
		this.initContext();
		this.initRating();
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.contextSynchronizer.dispose();
		this.ratingSynchronizer.dispose();
		this.discussionSynchronizer.dispose();
	}
	
	private initDiscussion() {
		this.viewModel.discussion = ko.observable<Discussion.ViewModel>();
		this.discussionSynchronizer = new KSync.DiscussionSynchronizer(this.communicator.discussion);
		this.discussionSynchronizer
			.setDiscussableModel(this.model)
			.setDiscussableViewModel(this.viewModel)
			.setViewModelObservable(this.viewModel.discussion)
			.setModelObservable(this.model.discussion);
	}
	
	private initGeneralContent() {
		this.viewModel.general = ko.observable<ContentViewModel.General>();
		
		this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(this.communicator.content)
			.setViewModelChangedHandler( value => this.viewModel.general(value) )
			.setModelObservable(this.model.general);
	}
	
	private initContext() {
		this.viewModel.context = ko.observable<ContentViewModel.Context>();
		
		this.contextSynchronizer = new KSync.ContextSynchronizer(this.communicator.content)
			.setViewModelChangedHandler( value => this.viewModel.context(value) )
			.setModelObservable(this.model.context);
	}
	
	private initRating() {
		this.viewModel.rating = ko.observable<Rating.ViewModel>();
		
		this.ratingSynchronizer = new KSync.RatingSynchronizer(this.communicator.rating);
		this.ratingSynchronizer
			.setRatableModel(this.model);
		this.ratingSynchronizer
			.setViewModelChangedHandler( value => this.viewModel.rating(value) )
			.setModelObservable(this.model.rating);
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.cxt = cxt;
		this.discussionSynchronizer.setViewModelContext(cxt);
		return this;
	}
	
	public model: Mdl;
	public viewModel: Vm;
	public communicator: Com;
	public cxt: ViewModelContext;
		
	public generalContentSynchronizer: KSync.GeneralContentSynchronizer;
	public contextSynchronizer: KSync.ContextSynchronizer;
	public ratingSynchronizer: KSync.RatingSynchronizer;
	public discussionSynchronizer: KSync.DiscussionSynchronizer;
}