import evt = require('event')
import ConstructorBasedFactory = require('factories/constructorbased')
import Obs = require('observable')

import mdl = require('konsenskistemodel')
import vm = require('konsenskisteviewmodel')

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
}

export class ControllerImpl implements Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: KokiCommunicator.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: KokiCommunicator.Main) {
		this.model = model;
		this.viewModel = viewModel;
		this.communicator = communicator;
		
		this.initChildKaSynchronizer();
		this.initModelEvents();
		this.initViewModel();
		this.initCommunicator();
		
		this.initKas();
		this.initComments();
		
		this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content)
			.setViewModelChangedHandler( value => this.viewModel.general(value) )
			.setModelObservable(this.model.general);
			
		this.contextSynchronizer = new KSync.ContextSynchronizer()
			.setViewModelChangedHandler( value => this.viewModel.context(value) )
			.setModelObservable(this.model.context);
			
		this.ratingSynchronizer = new KSync.RatingSynchronizer()
			.setViewModelChangedHandler( value => this.viewModel.rating(value) )
			.setModelObservable(this.model.rating);
	}
	
	private initChildKaSynchronizer() {
		var sync = this.childKaArraySynchronizer = new KokiSync.KaSynchronizer(this.communicator.content);;
		
		sync.setViewModelInsertionHandler(vm => this.insertKaViewModel(vm));
		sync.setViewModelRemovalHandler(vm => this.removeKaViewModel(vm));
	}
	
	private initModelEvents() {
		this.modelSubscriptions = [
			this.model.childKaInserted.subscribe( args => this.onChildKaInserted(args.childKa) ),
			this.model.childKaRemoved.subscribe( args => this.onChildKaRemoved(args.childKa) ),
			
			/*this.model.comments.pushed.subscribe( comment => this.commentSynchronizer.inserted(comment) ),
			this.model.comments.removed.subscribe( comment => this.commentSynchronizer.removed(comment) ),
			this.model.comments.changed.subscribe( old => this.commentSynchronizer.setInitialState(this.model.comments.get()) )*/
		];
	}
	
	private initViewModel() {
		this.viewModel.general = ko.observable<ContentViewModel.General>();
		this.viewModel.context = ko.observable<ContentViewModel.Context>();
		this.viewModel.rating = ko.observable<Rating.ViewModel>();
		this.viewModel.comments = ko.observableArray<Comment.ViewModel>();
		
		this.viewModel.childKas = this.childKaViewModels;
	}
	
	private initCommunicator() {
		this.communicatorSubscriptions = ([
			this.communicator.content.generalContentRetrieved.subscribe((args: ContentCommunicator.GeneralContentRetrievedArgs) => {
				if(args.general.id == this.model.general().id)
					this.model.general().set( args.general );
			}),
			this.communicator.content.contextRetrieved.subscribe((args: ContentCommunicator.ContextRetrievedArgs) => {
				if(args.context.id == this.model.context().id)
					this.model.context().set( args.context );
			}),
			this.communicator.received.subscribe(this.onKokiRetrieved)
		]);
	}
	
	private initKas() {
		this.childKaArraySynchronizer.setInitialState(this.model.childKas());
	}
	
	private initComments() {
		var sync = this.commentSynchronizer = new CommentSynchronizer(this.communicator.content);
		
		sync.setModelObservable(this.model.comments);
		
		sync.setViewModelInsertionHandler(vm => this.insertCommentViewModel(vm));
		sync.setViewModelRemovalHandler(vm => this.removeCommentViewModel(vm));
		
		//sync.setInitialState(this.model.comments.get());
	}
	
	private onKokiRetrieved = (args: KokiCommunicator.ReceivedArgs) => {
		if(this.model.id == args.konsenskiste.id)
			this.model.set( args.konsenskiste );
	}
	
	private getChildKaArray() {
		return this.model.getChildKaArray();
	}
	
	private onChildKaInserted(kaMdl: kernaussageMdl.Model) {
		this.childKaArraySynchronizer.inserted(kaMdl);
	}
	
	private onChildKaRemoved(kaMdl: kernaussageMdl.Model) {
		this.childKaArraySynchronizer.removed(kaMdl);
	}
	
	private insertKaViewModel(vm: kernaussageVm.ViewModel) {
		this.childKaViewModels.push(vm);
	}
	
	private removeKaViewModel(vm: kernaussageVm.ViewModel) {
		this.childKaViewModels.remove(vm);
	}
	
	/*private onCommentModelInserted(comment: Comment.Model) {
		this.commentSynchronizer.inserted(comment);
	}
	
	private onCommentModelRemoved(comment: Comment.Model) {
		this.commentSynchronizer.removed(comment);
	}*/
	
	private insertCommentViewModel(comment: Comment.ViewModel) {
		this.viewModel.comments.push(comment);
	}
	
	private removeCommentViewModel(comment: Comment.ViewModel) {
		this.viewModel.comments.remove(comment);
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
	
	private childKaViewModels = ko.observableArray<kernaussageVm.ViewModel>();
	private childKaArraySynchronizer: KokiSync.KaSynchronizer;
	private commentSynchronizer: CommentSynchronizer;
		
	private generalContentSynchronizer: KSync.GeneralContentSynchronizer;
	private contextSynchronizer: KSync.ContextSynchronizer;
	private ratingSynchronizer: KSync.RatingSynchronizer;
	
	private modelSubscriptions: evt.Subscription[];
	private communicatorSubscriptions: evt.Subscription[];
}