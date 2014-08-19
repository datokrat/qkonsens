import mdl = require('konsenskistemodel')
import vm = require('konsenskisteviewmodel')

import kernaussageMdl = require('kernaussagemodel')
import kernaussageVm = require('kernaussageviewmodel')
import kernaussageCtr = require('kernaussagecontroller')

import synchronizer = require('childarraysynchronizer')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		this.model = model;
		this.viewModel = viewModel;
		
		var sync = this.childKaArraySynchronizer;
		sync.setViewModelFactory(new ViewModelFactory());
		sync.setControllerFactory(new ControllerFactory());
		sync.setViewModelInsertionHandler(vm => this.insertKaViewModel(vm));
		sync.setViewModelRemovalHandler(vm => this.removeKaViewModel(vm));
		
		model.childKaInserted.subscribe( args => this.onChildKaInserted(args.childKa) );
		model.childKaRemoved.subscribe( args => this.onChildKaRemoved(args.childKa) );
		
		viewModel.childKas = this.childKaViewModels;
	}
	
	private getChildKaArray() {
		return this.model.getChildKaArray();
	}
	
	private onChildKaInserted(kaMdl: kernaussageMdl.Model) {
		/*var kaVm = new kernaussageVm.ViewModel();
		var kaCtr = new kernaussageCtr.Controller(kaMdl, kaVm);
		
		this.childKaViewModels.push(kaVm);*/
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
	
	private model: mdl.Model;
	private viewModel: vm.ViewModel;
	
	private childKaViewModels = ko.observableArray<kernaussageVm.ViewModel>();
	private childKaArraySynchronizer = 
		new synchronizer.ChildArraySynchronizer<kernaussageMdl.Model, kernaussageVm.ViewModel, kernaussageCtr.Controller>();
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