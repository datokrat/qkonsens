import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		viewModel.title = () => model.title();
		viewModel.isActive = ko.observable<boolean>();
	}
}