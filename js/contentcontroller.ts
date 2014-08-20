import mdl = require('contentmodel')
import vm = require('contentviewmodel')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		this.viewModel = viewModel;
		viewModel.title = () => model.title();
		viewModel.text = () => model.text();
	}
	
	public dispose() {
		this.viewModel.title = null;
		this.viewModel.text = null;
	}
	
	private viewModel: vm.ViewModel;
}