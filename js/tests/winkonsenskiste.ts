import unit = require('tests/tsunit')
import test = require('tests/test')
import Common = require('../common');
import Commands = require('../command');
import KokiLogic = require('../kokilogic');

import KonsenskisteModel = require('../konsenskistemodel')
import win = require('windows/konsenskiste')
import ctr = require('windows/konsenskistecontroller')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')
import ViewModelContext = require('../viewmodelcontext');

import kaMdl = require('../kernaussagemodel')

export class Tests extends unit.TestClass {
	private konsenskisteModel: KonsenskisteModel.Model;
	private window: win.Win;
	private controller: ctr.ControllerImpl;
	private commandProcessor: Commands.CommandProcessor;
	
	setUp() {
		this.konsenskisteModel = new KonsenskisteModel.Model();
		this.window = new win.Win();
		this.commandProcessor = new Commands.CommandProcessor();
		this.controller = new ctr.ControllerImpl(this.konsenskisteModel, this.window, {communicator: new KokiCommunicator.Main, commandProcessor: this.commandProcessor});
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
		var newModel = new KonsenskisteModel.Model;
		
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
			var controller = new ctr.ControllerImpl(null, window, {communicator: new KokiCommunicator.Main, commandProcessor: this.commandProcessor});
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
	
	emitHandleChangedKokiStateCommand() {
		var counter = new Common.Counter();
		this.commandProcessor.chain.append(cmd => {
			counter.inc('cmd');
			test.assert(v => cmd instanceof KokiLogic.HandleChangedKokiWinStateCommand);
			return true;
		});
		
		var kokiModel = new KonsenskisteModel.Model();
		kokiModel.id(3);
		this.controller.setKonsenskisteModel(kokiModel);
		
		test.assert(v => v.val(counter.get('cmd')) == 1);
	}
    
    /*contextImplementation() {
		this.controller.setContext(new ViewModelContext(null, null, null));
		
		test.assert( () => this.controller['konsenskisteController']['cxt'] );
    }*/
}