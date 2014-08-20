import unit = require('tests/tsunit')
import test = require('tests/test')

import mdl = require('../kernaussagemodel')
import vm = require('../kernaussageviewmodel')
import ctr = require('../kernaussagecontroller')

export class Tests extends unit.TestClass {
	private modelFactory = new ModelFactory();

	test() {
		var model = this.modelFactory.create( 'Begriff Basisdemokratie' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		test.assert( () => viewModel.content.title() == 'Begriff Basisdemokratie' );
	}
}

class ModelFactory {
	public create(title: string) {
		var kernaussage = new mdl.Model();
		kernaussage.content.title(title);
		return kernaussage;
	}
}