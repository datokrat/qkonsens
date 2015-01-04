import unit = require('tests/tsunit');
import test = require('tests/test');
import Topic = require('../topic');
import TopicCommunicator = require('tests/testtopiccommunicator');

export class Tests extends unit.TestClass {
	properties() {
		var model = new Topic.Model();
		var viewModel = new Topic.ViewModel();
		var controller = new Topic.ModelViewModelController(model, viewModel);
		
		model.title('Parent Title');
		model.text('Parent Text');
		
		test.assert(() => viewModel.caption() == 'Parent Title');
		test.assert(() => viewModel.description() == 'Parent Text');
		
		viewModel.click();
	}
}