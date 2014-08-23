import unit = require('tests/tsunit')
import test = require('tests/test')

import Controller = require('../contextcontroller')
import ViewModel = require('../contextviewmodel')
import Model = require('../contextmodel')

export class Tests extends unit.TestClass {
	private factory = new Factory();

	testText() {
		var cxt = this.factory.create();
		
		cxt.model.text('Klärtext');
		
		test.assert( () => cxt.viewModel.text() == 'Klärtext' );
	}
	
	testVisibility() {
		var cxt = this.factory.create();
		
		test.assert( () => cxt.viewModel.isVisible() == false );
	}
	
	testDispose() {
		var cxt = this.factory.create();
		
		cxt.model.text('Klärtext');
		cxt.controller.dispose();
		cxt.model.text('This won\'t be updated to ViewModel');
		
		test.assert( () => cxt.viewModel.text() == 'Klärtext' );
	}
}

class Factory {
	public create() {
		var model = new Model();
		var viewModel = new ViewModel();
		var controller = new Controller(model, viewModel);
		
		return { model: model, viewModel: viewModel, controller: controller };
	}
}