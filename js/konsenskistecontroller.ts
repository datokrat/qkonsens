import mdl = require('konsenskistemodel')
import vm = require('konsenskisteviewmodel')

import kernaussageMdl = require('kernaussagemodel')
import kernaussageVm = require('kernaussageviewmodel')
import kernaussageCtr = require('kernaussagecontroller')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		this.model = model;
		this.viewModel = viewModel;
		
		model.childKaInserted.subscribe( args => this.onChildKaInserted(args.childKa) );
		model.childKaRemoved.subscribe( args => this.onChildKaRemoved(args.childKa) );
		
		viewModel.childKas = this.childKaViewModels;
	}
	
	private getChildKaArray() {
		return this.model.getChildKaArray();
	}
	
	private onChildKaInserted(kaMdl: kernaussageMdl.Model) {
		var kaVm = new kernaussageVm.ViewModel();
		var kaCtr = new kernaussageCtr.Controller(kaMdl, kaVm);
		
		this.childKaViewModels.push(kaVm);
	}
	
	private onChildKaRemoved(kaMdl: kernaussageMdl.Model) {
	}
	
	private model: mdl.Model;
	private viewModel: vm.ViewModel;
	
	private childKaViewModels = ko.observableArray<kernaussageVm.ViewModel>();
}