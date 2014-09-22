import observable = require('observable')

import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')
import com = require('contentcommunicator')

import Content = require('contentcontroller')
import ContentViewModel = require('contentviewmodel')

export class Controller {
	private viewModel: vm.ViewModel;
	private content: Content.Controller;

	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		viewModel.isActive = ko.observable<boolean>();
		viewModel.content = ko.observable( new ContentViewModel.WithContext );
		this.viewModel = viewModel;
		
		this.content = new Content.WithContext(model.content, viewModel.content(), communicator);
	}
	
	public dispose() {
		this.content.dispose();
	}
}