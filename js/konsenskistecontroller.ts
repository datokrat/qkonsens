import evt = require('event')

import mdl = require('konsenskistemodel')
import vm = require('konsenskisteviewmodel')

import kernaussageMdl = require('kernaussagemodel')
import kernaussageVm = require('kernaussageviewmodel')
import kernaussageCtr = require('kernaussagecontroller')

import Communicator = require('communicator')

import contentVm = require('contentviewmodel');

import content = require('contentcontroller')
import synchronizer = require('childarraysynchronizer')

export interface Controller {
	dispose(): void;
}

export class ControllerImpl implements Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: Communicator.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: Communicator.Main) {
		this.model = model;
		this.viewModel = viewModel;
		this.communicator = communicator;
		
		this.initChildKaSynchronizer();
		this.initModelEvents();
		this.initViewModel();
		this.initCommunicator();
		
		this.content = new content.WithContext(this.model.content, this.viewModel.content());
	}
	
	private initChildKaSynchronizer() {
		var sync = this.childKaArraySynchronizer;
		
		sync.setViewModelFactory(new ViewModelFactory());
		sync.setControllerFactory(new ControllerFactory());
		sync.setViewModelInsertionHandler(vm => this.insertKaViewModel(vm));
		sync.setViewModelRemovalHandler(vm => this.removeKaViewModel(vm));
	}
	
	private initModelEvents() {
		this.modelSubscriptions = [
			this.model.childKaInserted.subscribe( args => this.onChildKaInserted(args.childKa) ),
			this.model.childKaRemoved.subscribe( args => this.onChildKaRemoved(args.childKa) )
		];
	}
	
	private initViewModel() {
		this.viewModel.content = ko.observable( new contentVm.WithContext );
		this.viewModel.childKas = this.childKaViewModels;
	}
	
	private initCommunicator() {
		this.communicator.contentRetrieved.subscribe((args: Communicator.ContentReceivedArgs) => {
			if(args.id == this.model.id) {
				this.model.content.title( args.content.title() );
				this.model.content.text( args.content.text() );
			}
		})
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
		this.content.dispose();
		this.modelSubscriptions.forEach( s => s.undo() );
	}
	
	private model: mdl.Model;
	private viewModel: vm.ViewModel;
	private communicator: Communicator.Main;
	
	private content: content.WithContext;
	
	private childKaViewModels = ko.observableArray<kernaussageVm.ViewModel>();
	private childKaArraySynchronizer = 
		new synchronizer.ChildArraySynchronizer<kernaussageMdl.Model, kernaussageVm.ViewModel, kernaussageCtr.Controller>();
	
	private modelSubscriptions: evt.Subscription[];
}

class ViewModelFactory {
	public create() {
		return new kernaussageVm.ViewModel();
	}
}

class ControllerFactory {
	public create(model: kernaussageMdl.Model, viewModel: kernaussageVm.ViewModel) {
		return new kernaussageCtr.Controller(model, viewModel);
	}
}

export class NullController {
	constructor(viewModel: vm.ViewModel) {
	}
	
	public dispose() {
	}
}