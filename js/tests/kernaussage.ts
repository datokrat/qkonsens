import unit = require('tests/tsunit')
import test = require('tests/test')

import Model = require('../kernaussagemodel')
import ViewModel = require('../kernaussageviewmodel')
import Controller = require('../kernaussagecontroller')
import KernaussageCommunicator = require('tests/testkernaussagecommunicator')
import Commands = require('../command');

export class Tests extends unit.TestClass {
	private modelFactory = new ModelFactory();

	contentSync() {
		var model = this.modelFactory.create( 'Begriff Basisdemokratie', 'Basisdemokratie ist Demokratie, die aus der Basis kommt', 'Baduum-Disch!' );
		var viewModel = new ViewModel.ViewModel();
		var communicator = new KernaussageCommunicator();
		var controller = new Controller.Controller(model, viewModel, { communicator: communicator, commandProcessor: null });
		
		test.assert( () => viewModel.general().title() == 'Begriff Basisdemokratie' );
	}
}

class ModelFactory {
	public create(title: string, text: string, context?: string) {
		var kernaussage = new Model.Model();
		kernaussage.general().title(title);
		kernaussage.general().text(text);
		kernaussage.context().text(context);
		return kernaussage;
	}
}