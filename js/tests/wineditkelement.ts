import unit = require('tests/tsunit');
import test = require('tests/test');
import Common = require('../common');
import Commands = require('../command');

import EditKElementWin = require('windows/editkelement');
import KElementCommands = require('../kelementcommands');
import KonsenskisteModel = require('../konsenskistemodel');

export class Tests extends unit.TestClass {
	emitUpdateGeneralContentCommand() {
		var counter = new Common.Counter();
		var commandProcessor = new Commands.CommandProcessor();
		var win = EditKElementWin.Main.CreateEmpty(commandProcessor);
		win.model.setKElementModel(new KonsenskisteModel.Model);
		
		commandProcessor.chain.insertAtBeginning(cmd => {
			if(cmd instanceof KElementCommands.UpdateGeneralContentCommand) {
				counter.inc('cmd');
				return true;
			}
			return false;
		});
		
		win.frame.submitGeneralContent();
		
		test.assert(v => v.val(counter.get('cmd')) == 1);
	}
	
	emitUpdateContextCommand() {
		var counter = new Common.Counter();
		var commandProcessor = new Commands.CommandProcessor();
		var win = EditKElementWin.Main.CreateEmpty(commandProcessor);
		win.model.setKElementModel(new KonsenskisteModel.Model);
		
		commandProcessor.chain.insertAtBeginning(cmd => {
			if(cmd instanceof KElementCommands.UpdateContextCommand) {
				counter.inc('cmd');
				return true;
			}
			return false;
		});
		
		win.frame.submitContext();
		
		test.assert(v => v.val(counter.get('cmd')) == 1);
	}
}