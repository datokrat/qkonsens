import evt = require('event')
import ConstructorBasedFactory = require('factories/constructorbased')
import Obs = require('observable')

import mdl = require('konsenskistemodel')
import vm = require('konsenskisteviewmodel')
import ViewModelContext = require('viewmodelcontext')

import kernaussageMdl = require('kernaussagemodel')
import kernaussageVm = require('kernaussageviewmodel')
import kernaussageCtr = require('kernaussagecontroller')
import KokiCommunicator = require('konsenskistecommunicator')

import ContentModel = require('contentmodel')
import ContentViewModel = require('contentviewmodel')
import ContentCommunicator = require('contentcommunicator')
import Discussable = require('discussable')
import DiscussableCommunicator = require('discussablecommunicator')
import ContentController = require('contentcontroller')

import Rating = require('rating')
import Comment = require('comment')

import contentVm = require('contentviewmodel');

import content = require('contentcontroller')
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
		this.initViewModel();
		
		this.initKas();
		this.initDiscussable();
		this.initGeneralContent();
		this.initContext();
		this.initRating();
	}
	
	public setContext(cxt: ViewModelContext) {
		this.cxt = cxt;
		this.discussable.setViewModelContext(cxt);
		return this;
	}
	
	private initViewModel() {
	}
	
	private initKas() {
		this.viewModel.childKas = ko.observableArray<kernaussageVm.ViewModel>();
		
		this.kaSynchronizer = new KokiSync.KaSynchronizer(this.communicator.kernaussage)
			.setViewModelObservable(this.viewModel.childKas)
			.setModelObservable(this.model.childKas);
	}
	
	private initDiscussable() {
		this.discussable = new Discussable.Controller(this.model, this.viewModel, this.communicator);
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
		
		this.ratingSynchronizer = new KSync.RatingSynchronizer()
			.setViewModelChangedHandler( value => this.viewModel.rating(value) )
			.setModelObservable(this.model.rating);
	}
	
	private initCommunicator() {
		this.communicatorSubscriptions = ([
			this.communicator.received.subscribe(this.onKokiReceived),
			this.communicator.commentsReceived.subscribe(this.onCommentsReceived),
		]);
	}
	
	private onKokiReceived = (args: KokiCommunicator.ReceivedArgs) => {
		if(this.model.id == args.konsenskiste.id)
			this.model.set( args.konsenskiste );
	}
	
	private onCommentsReceived = (args: DiscussableCommunicator.ReceivedArgs) => {
		if(this.model.id == args.id)
			this.model.comments.set(args.comments);
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.contextSynchronizer.dispose();
		this.ratingSynchronizer.dispose();
		this.discussable.dispose();
		
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
	private discussable: Discussable.Controller;
	
	private modelSubscriptions: evt.Subscription[] = [];
	private communicatorSubscriptions: evt.Subscription[] = [];
}