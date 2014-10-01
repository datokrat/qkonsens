import evt = require('event')
import ConstructorBasedFactory = require('factories/constructorbased')

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

import contentVm = require('contentviewmodel');

import content = require('contentcontroller')
import arraySynchronizer = require('childarraysynchronizer')
import synchronizer = require('childsynchronizer')

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
		
		this.generalContentSynchronizer
			.setViewModelFactory( new ConstructorBasedFactory.Factory(ContentViewModel.General) )
			.setControllerFactory( new ConstructorBasedFactory.ControllerFactoryEx(ContentController.General, communicator.content) )
			.setViewModelChangedHandler( value => this.viewModel.general(value) )
			.setModelObservable(this.model.general);
			
		this.context = new content.Context(this.model.context(), this.viewModel.context());
		this.rating = new Rating.Controller(model.rating(), viewModel.rating());
	}
	
	private initChildKaSynchronizer() {
		var sync = this.childKaArraySynchronizer;
		
		sync.setViewModelFactory(new ViewModelFactory());
		sync.setControllerFactory(new ControllerFactory(this.communicator.content));
		sync.setViewModelInsertionHandler(vm => this.insertKaViewModel(vm));
		sync.setViewModelRemovalHandler(vm => this.removeKaViewModel(vm));
	}
	
	private initModelEvents() {
		this.modelSubscriptions = [
			this.model.childKaInserted.subscribe( args => this.onChildKaInserted(args.childKa) ),
			this.model.childKaRemoved.subscribe( args => this.onChildKaRemoved(args.childKa) ),
			
			//evt.Subscription.fromDisposable(this.model.general.subscribe( () => this.onGeneralContentChanged() )),
			//evt.Subscription.fromDisposable(this.model.general.subscribe( cnt => this.generalContentSynchronizer.modelChanged(cnt) )),
			evt.Subscription.fromDisposable(this.model.context.subscribe( () => this.onContextChanged() ))
		];
	}
	
	private initViewModel() {
		this.viewModel.general = ko.observable( new contentVm.General );
		this.viewModel.context = ko.observable( new contentVm.Context );
		this.viewModel.rating = ko.observable( new Rating.ViewModel );
		
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
		this.model.childKas().forEach(this.onChildKaInserted.bind(this));
	}
	
	private onGeneralContentChanged = () => {
		this.generalContent.dispose();
		this.generalContent = new content.General( this.model.general(), this.viewModel.general(), this.communicator.content );
	}
	
	private onContextChanged = () => {
		this.context.dispose();
		this.context = new content.Context( this.model.context(), this.viewModel.context() );
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
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.context.dispose();
		
		this.modelSubscriptions.forEach( s => s.undo() );
		this.communicatorSubscriptions.forEach( s => s.undo() );
	}
	
	private model: mdl.Model;
	private viewModel: vm.ViewModel;
	private communicator: KokiCommunicator.Main;
	
	private generalContent: content.General;
	private context: content.Context;
	private rating: Rating.Controller;
	
	private childKaViewModels = ko.observableArray<kernaussageVm.ViewModel>();
	private childKaArraySynchronizer = 
		new arraySynchronizer.ChildArraySynchronizer<kernaussageMdl.Model, kernaussageVm.ViewModel, kernaussageCtr.Controller>();
	private generalContentSynchronizer = 
		new GeneralContentSynchronizer();
	
	private modelSubscriptions: evt.Subscription[];
	private communicatorSubscriptions: evt.Subscription[];
}

class GeneralContentSynchronizer 
	extends synchronizer.ChildSynchronizer<ContentModel.General, ContentViewModel.General, ContentController.General> {}

class GeneralContentControllerFactory
	extends ConstructorBasedFactory.ControllerFactoryEx<ContentModel.General, ContentViewModel.General, ContentCommunicator.Main, ContentController.General> {}

class ViewModelFactory {
	public create() {
		return new kernaussageVm.ViewModel();
	}
}

class ControllerFactory {
	constructor( private communicator: ContentCommunicator.Main ) {
	}
	
	public create(model: kernaussageMdl.Model, viewModel: kernaussageVm.ViewModel) {
		return new kernaussageCtr.Controller(model, viewModel, this.communicator);
	}
}

export class NullController {
	constructor(viewModel: vm.ViewModel) {
	}
	
	public dispose() {
	}
}