import unit = require('tests/tsunit')
import test = require('tests/test')

import Model = require('../kernaussagemodel')
import ViewModel = require('../kernaussageviewmodel')
import Controller = require('../kernaussagecontroller')
import ContentCommunicator = require('tests/testcontentcommunicator')

export class Tests extends unit.TestClass {
	private modelFactory = new ModelFactory();

	test() {
		var model = this.modelFactory.create( 'Begriff Basisdemokratie', 'Basisdemokratie ist Demokratie, die aus der Basis kommt', 'Baduum-Disch!' );
		var viewModel = new ViewModel.ViewModel();
		var communicator = new ContentCommunicator();
		var controller = new Controller.Controller(model, viewModel, communicator);
		
		test.assert( () => viewModel.content().title() == 'Begriff Basisdemokratie' );
	}
}

class ModelFactory {
	public create(title: string, text: string, context?: string) {
		var kernaussage = new Model.Model();
		kernaussage.content.title(title);
		kernaussage.content.text(text);
		kernaussage.content.context().text(context);
		return kernaussage;
	}
}