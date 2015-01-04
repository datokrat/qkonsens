import unit = require('tests/tsunit')
import test = require('tests/test')

import kokiMdl = require('../konsenskistemodel')
import win = require('windows/konsenskiste')
import ctr = require('windows/konsenskistecontroller')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')
import ViewModelContext = require('../viewmodelcontext');

import kaMdl = require('../kernaussagemodel')

export class Tests extends unit.TestClass {
	private konsenskisteModel: kokiMdl.Model;
	private window: win.Win;
	private controller: ctr.Controller;
	
	setUp() {
		this.konsenskisteModel = new kokiMdl.Model();
		this.window = new win.Win();
		this.controller = new ctr.Controller(this.konsenskisteModel, this.window, new KokiCommunicator.Main);
	}
	
	tearDown() {
		this.controller.dispose();
	}
	
	testKkView() {
		this.konsenskisteModel.general().title('Title')
		
		test.assert( () => this.window.kkView().general().title() == 'Title' );
		test.assert( () => this.window.kkView().childKas != null );
	}
	
	testSetKonsenskisteModel() {
		var newModel = new kokiMdl.Model;
		
		var currentTitle = ko.computed<string>( () => this.window.kkView().general().title() );
		
		this.konsenskisteModel.general().title('Alt');
		newModel.general().title('Neu');
		this.controller.setKonsenskisteModel(newModel);
		test.assert( () => currentTitle() == 'Neu' );
		newModel.general().title('Basisdemokratie');
		test.assert( () => currentTitle() == 'Basisdemokratie' );
	}
	
	testNullModel() {
		try {
			var window = new win.Win;
			var controller = new ctr.Controller(null, window, new KokiCommunicator.Main);
		}
		finally {
			controller && controller.dispose();
		}
	}
	
	testAComplexUseCase() {
		var ka = new kaMdl.Model();
		this.konsenskisteModel.childKas.push(ka);
		
		this.konsenskisteModel.general().title('Basisdemokratie');
		ka.general().title('Begriff Basisdemokratie');
		ka.general().text('Blablablablub');
		
		test.assert( () => this.window.kkView().general().title() == 'Basisdemokratie' );
		test.assert( () => this.window.kkView().childKas().length == 1 );
		test.assert( () => this.window.kkView().childKas()[0].general().title() == 'Begriff Basisdemokratie' );
		test.assert( () => this.window.kkView().childKas()[0].general().text() == 'Blablablablub' );
	}
    
    contextImplementation() {
		this.controller.setContext(new ViewModelContext(null, null, null));
		
		test.assert( () => this.controller['konsenskisteController']['cxt'] );
    }
}