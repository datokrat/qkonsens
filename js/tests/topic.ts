import unit = require('tests/tsunit');
import test = require('tests/test');
import Topic = require('../topic');

export class Tests extends unit.TestClass {
	properties() {
		var model = new Topic.ParentModel();
		var viewModel = new Topic.ParentViewModel();
		var controller = new Topic.ParentController(model, viewModel);
		
		model.properties().title('Parent Title');
		model.properties().text('Parent Text');
		
		test.assert(() => viewModel.caption() == 'Parent Title');
		test.assert(() => viewModel.description() == 'Parent Text');
		test.assert(() => viewModel.children() != null);
		
		viewModel.click();
	}
	
	children() {
		var model = new Topic.ParentModel();
		var viewModel = new Topic.ParentViewModel();
		var controller = new Topic.ParentController(model, viewModel);
		
		model.children.push(new Topic.Model);
		model.children.get()[0].title('Child Title');
		
		test.assert(() => viewModel.children().length == 1);
	}
}