import unit = require('tests/tsunit')
import test = require('tests/test')

import ModelFactory = require('../factories/contentmodel')
import mdl = require('../model')
import vm = require('../contentviewmodel')
import ctr = require('../contentcontroller')
import ContentCommunicator = require('tests/testcontentcommunicator')

export class General extends unit.TestClass {
	public modelFactory = new ModelFactory;
	
	test() {
		var model = this.modelFactory.createGeneralContent('Text', 'Title');
		var viewModel = new vm.General();
		var communicator = new ContentCommunicator();
		var controller = new ctr.General(model, viewModel, communicator);
		
		test.assert( () => viewModel.title() == 'Title' );
		test.assert( () => viewModel.text() == 'Text' );
	}
	
	testDispose() {
		var model = this.modelFactory.createGeneralContent('Text', 'Title');
		var viewModel = new vm.General();
		var communicator = new ContentCommunicator();
		var controller = new ctr.General(model, viewModel, communicator);
		
		controller.dispose();
		model.title('New Title');
		model.text('New Text');
		
		test.assert( () => viewModel.title() == 'Title' );
		test.assert( () => viewModel.text() == 'Text' );
	}
}

export class Context {
	modelFactory = new ModelFactory;

	testModelWithContext() {
		var model = this.modelFactory.createContext('Context');
		var viewModel = new vm.Context();
		var controller = new ctr.Context(model, viewModel);
		
		test.assert( () => viewModel.text() == 'Context' );
	}
	
	testDisposeWithContext() {
		var model = this.modelFactory.createContext('Context');
		var viewModel = new vm.Context();
		var controller = new ctr.Context(model, viewModel);
		
		controller.dispose();
		model.text('New Context');
		
		test.assert( () => viewModel.text() == 'Context' );
	}
}