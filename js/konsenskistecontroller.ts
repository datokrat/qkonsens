import evt = require('event')
import ConstructorBasedFactory = require('factories/constructorbased')
import Obs = require('observable')

import mdl = require('konsenskistemodel')
import vm = require('konsenskisteviewmodel')
import ViewModelContext = require('viewmodelcontext')

import kernaussageVm = require('kernaussageviewmodel')
import KokiCommunicator = require('konsenskistecommunicator')

import ContentViewModel = require('contentviewmodel')
import Discussion = require('discussion')
import DiscussionCommunicator = require('discussioncommunicator')

import Rating = require('rating')
import Comment = require('comment')

import KSync = require('synchronizers/ksynchronizers')
import KokiSync = require('synchronizers/kokisynchronizers')
import CommentSynchronizer = require('synchronizers/comment')

export interface Controller {
	dispose(): void;
	setContext(cxt: ViewModelContext): void;
}

export class ControllerImpl implements Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: KokiCommunicator.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: KokiCommunicator.Main) {
		this.model = model;
		this.viewModel = viewModel;
		this.communicator = communicator;
		
		this.initCommunicator();
		
		this.initKas();
		this.initDiscussion();
		this.initGeneralContent();
		this.initContext();
		this.initRating();
	}
	
	public setContext(cxt: ViewModelContext) {
		this.cxt = cxt;
		this.discussionSynchronizer.setViewModelContext(cxt);
		this.kaSynchronizer.setViewModelContext(cxt);
		return this;
	}
	
	private initKas() {
		this.viewModel.childKas = ko.observableArray<kernaussageVm.ViewModel>();
		this.viewModel.newKaFormVisible = ko.observable<boolean>(false);
		this.viewModel.newKaClick = () => {
			var oldValue = this.viewModel.newKaFormVisible();
			this.viewModel.newKaFormVisible(!oldValue);
		}
		
		this.kaSynchronizer = new KokiSync.KaSynchronizer(this.communicator.kernaussage);
		this.kaSynchronizer
			.setViewModelObservable(this.viewModel.childKas)
			.setModelObservable(this.model.childKas);
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
			.setViewModelChangedHandler( value => this.viewModel.rating(value) )
			.setModelObservable(this.model.rating);
	}
	
	private initCommunicator() {
		this.communicatorSubscriptions = ([
			this.communicator.received.subscribe(this.onKokiReceived),
		]);
	}
	
	private onKokiReceived = (args: KokiCommunicator.ReceivedArgs) => {
		if(this.model.id() == args.konsenskiste.id())
			this.model.set( args.konsenskiste );
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.contextSynchronizer.dispose();
		this.ratingSynchronizer.dispose();
		this.discussionSynchronizer.dispose();
		
		this.modelSubscriptions.forEach( s => s.undo() );
		this.communicatorSubscriptions.forEach( s => s.undo() );
	}
	
	private model: mdl.Model;
	private viewModel: vm.ViewModel;
	private communicator: KokiCommunicator.Main;
	private cxt: ViewModelContext;
		
	private generalContentSynchronizer: KSync.GeneralContentSynchronizer;
	private contextSynchronizer: KSync.ContextSynchronizer;
	private ratingSynchronizer: KSync.RatingSynchronizer;
	private kaSynchronizer: KokiSync.KaSynchronizer;
	private discussionSynchronizer: KSync.DiscussionSynchronizer;
	
	private modelSubscriptions: evt.Subscription[] = [];
	private communicatorSubscriptions: evt.Subscription[] = [];
}