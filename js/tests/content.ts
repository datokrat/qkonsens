import unit = require('tests/tsunit')
import test = require('tests/test')

import ModelFactory = require('../factories/contentmodel')
import mdl = require('../model')
import vm = require('../contentviewmodel')
import ctr = require('../contentcontroller')
import ContentCommunicator = require('tests/testcontentcommunicator')

export class Tests extends unit.TestClass {
	public modelFactory = new ModelFactory;
	
	test() {
		var model = this.modelFactory.create('Text', 'Title');
		var viewModel = new vm.ViewModel();
		var communicator = new ContentCommunicator();
		var controller = new ctr.Controller(model, viewModel, communicator);
		
		test.assert( () => viewModel.title() == 'Title' );
		test.assert( () => viewModel.text() == 'Text' );
	}
	
	testDispose() {
		var model = this.modelFactory.create('Text', 'Title');
		var viewModel = new vm.ViewModel();
		var communicator = new ContentCommunicator();
		var controller = new ctr.Controller(model, viewModel, communicator);
		
		controller.dispose();
		model.title('New Title');
		model.text('New Text');
		
		test.assert( () => viewModel.title() == 'Title' );
		test.assert( () => viewModel.text() == 'Text' );
	}
}

export class TestsWithContext extends Tests {

	testModelWithContext() {
		var model = this.modelFactory.createWithContext('Text', 'Title', 'Context');
		var viewModel = new vm.WithContext();
		var communicator = new ContentCommunicator();
		var controller = new ctr.WithContext(model, viewModel, communicator);
		
		test.assert( () => viewModel.context().text() == 'Context' );
	}
	
	testDisposeWithContext() {
		var model = this.modelFactory.createWithContext('Text', 'Title', 'Context');
		var viewModel = new vm.WithContext();
		var communicator = new ContentCommunicator();
		var controller = new ctr.WithContext(model, viewModel, communicator);
		
		controller.dispose();
		model.context().text('New Context');
		
		test.assert( () => viewModel.context().text() == 'Context' );
	}
}