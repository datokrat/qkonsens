import unit = require('tests/tsunit');
import test = require('tests/test');
import Common = require('../common');

import Commands = require('../command');

import KokiLogic = require('../kokilogic');
import LocationHash = require('../locationhash');
import StateLogic = require('../statelogic');

export class Tests extends unit.TestClass {
	setUp() {
		this.counter = new Common.Counter();
	}
	
	handleChangedHash() {
		var resources = {
			commandProcessor: new Commands.CommandProcessor()
		};
		var stateLogic = new StateLogic.Controller(resources);
		
		resources.commandProcessor.chain.insertAtBeginning(cmd => {
			this.counter.inc('cmd');
			test.assert(v => cmd instanceof StateLogic.ChangeKokiStateCommand);
			test.assert(v => v.val((<StateLogic.ChangeKokiStateCommand>cmd).state.kokiId) == 3);
			return true;
		});
		
		LocationHash.changed.raise('#{"kokiId":3}');
		
		test.assert(v => v.val(this.counter.get('cmd')) == 1);
		stateLogic.dispose();
	}
	
	handleChangedKokiState() {
		var resources = {
			commandProcessor: new Commands.CommandProcessor()
		};
		var stateLogic = new StateLogic.Controller(resources);
		
		resources.commandProcessor.processCommand(new KokiLogic.HandleChangedKokiWinStateCommand({ kokiId: 3 }));
		
		test.assert(v => v.val(location.hash) == '#{"kokiId":3}');
		stateLogic.dispose();
	}
	
	initialize() {
		var resources = {
			commandProcessor: new Commands.CommandProcessor()
		};
		var stateLogic = new StateLogic.Controller(resources);
		
		resources.commandProcessor.chain.append(cmd => {
			this.counter.inc('changed');
			test.assert(v => cmd instanceof StateLogic.ChangeKokiStateCommand);
			return true;
		});
		
		stateLogic.initialize();
		
		test.assert(v => v.val(this.counter.get('changed')) == 1);
		stateLogic.dispose();
	}
	
	initializeWithEmptyHash() {
		LocationHash.changed.clear();
		location.hash = '';
		var resources = {
			commandProcessor: new Commands.CommandProcessor()
		};
		var stateLogic = new StateLogic.Controller(resources);
		
		resources.commandProcessor.chain.append(cmd => {
			this.counter.inc('changed');
			test.assert(v => cmd instanceof StateLogic.ChangeKokiStateCommand);
			test.assert(v => v.val((<StateLogic.ChangeKokiStateCommand>cmd).state.kokiId) == 12);
			return true;
		});
		
		stateLogic.initialize();
		
		test.assert(v => v.val(this.counter.get('changed')) == 1);
		stateLogic.dispose();
	}
	
	private counter: Common.Counter;
}