import unit = require('tests/tsunit')
import test = require('tests/test')

import modelFactory = require('../factories/contentmodel')
import mdl = require('../model')
import vm = require('../contentviewmodel')
import ctr = require('../contentcontroller')

export class Tests extends unit.TestClass {
	private modelFactory = new modelFactory.Factory();
	
	test() {
		var model = this.modelFactory.create('Text', 'Title');
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		test.assert( () => viewModel.title() == 'Title' );
		test.assert( () => viewModel.text() == 'Text' );
	}
}