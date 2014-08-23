import observable = require('observable')

import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')

import Content = require('contentcontroller')
import ContentViewModel = require('contentviewmodel')

export class Controller {
	private viewModel: vm.ViewModel;
	private content: Content.Controller;

	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		this.init(model, viewModel);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel) {
		viewModel.isActive = ko.observable<boolean>();
		viewModel.content = ko.observable( new ContentViewModel.WithContext );
		this.viewModel = viewModel;
		
		this.content = new Content.WithContext(model.content, viewModel.content());
	}
	
	public dispose() {
		this.content.dispose();
	}
}