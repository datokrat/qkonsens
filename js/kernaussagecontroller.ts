import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')

export class Controller {
	private viewModel: vm.ViewModel;

	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		viewModel.title = () => model.title();
		viewModel.isActive = ko.observable<boolean>();
		
		this.viewModel = viewModel;
	}
	
	public dispose() {
		this.viewModel.isActive = null;
		this.viewModel.title = null;
		this.viewModel = null;
	}
}