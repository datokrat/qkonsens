import observable = require('observable')

import mdl = require('contentmodel')
import vm = require('contentviewmodel')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		this.init(model, viewModel);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel) {
		this.viewModel = viewModel;
		this.model = model;
		
		this.viewModel.title = ko.computed( () => model.title() );
		this.viewModel.text = ko.computed( () => model.text() );
	}
	
	public dispose() {
		this.viewModel.title.dispose();
		this.viewModel.text.dispose();
	}
	
	private viewModel: vm.ViewModel;
	private model: mdl.Model;
}