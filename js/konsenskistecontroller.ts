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
		this.initComments();
		this.initGeneralContent();
		this.initContext();
		this.initRating();
	}
	
	public setContext(cxt: ViewModelContext) {
		this.cxt = cxt;
		return this;
	}
	
	private initViewModel() {
		this.viewModel.discussionClick = () => {
			if(this.cxt) {
				this.communicator.queryComments(this.model.id);
				this.cxt.discussionWindow.discussable(this.viewModel);
				this.cxt.setLeftWindow(this.cxt.discussionWindow);
			}
		}
	}
	
	private initKas() {
		this.viewModel.childKas = ko.observableArray<kernaussageVm.ViewModel>();
		
		this.kaSynchronizer = new KokiSync.KaSynchronizer(this.communicator.content)
			.setViewModelObservable(this.viewModel.childKas)
			.setModelObservable(this.model.childKas);
	}
	
	private initComments() {
		this.viewModel.comments = ko.observableArray<Comment.ViewModel>();
		
		this.commentSynchronizer = new CommentSynchronizer(this.communicator.content)
			.setViewModelObservable(this.viewModel.comments)
			.setModelObservable(this.model.comments);
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
	
	private onCommentsReceived = (args: KokiCommunicator.CommentsReceivedArgs) => {
		if(this.model.id == args.id)
			this.model.comments.set(args.comments);
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.contextSynchronizer.dispose();
		this.ratingSynchronizer.dispose();
		this.commentSynchronizer.dispose();
		
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
	private commentSynchronizer: CommentSynchronizer;
	private kaSynchronizer: KokiSync.KaSynchronizer;
	
	private modelSubscriptions: evt.Subscription[] = [];
	private communicatorSubscriptions: evt.Subscription[] = [];
}