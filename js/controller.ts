import mdl = require('model')
import vm = require('viewmodel')
import topicNavigationCtr = require('topicnavigationcontroller')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation);
	}
}