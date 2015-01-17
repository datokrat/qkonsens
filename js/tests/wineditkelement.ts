import unit = require('tests/tsunit');
import test = require('tests/test');
import Common = require('../common');
import Commands = require('../command');

import EditKElementWin = require('windows/editkelement');
import KElementCommands = require('../kelementcommands');
import KonsenskisteModel = require('../konsenskistemodel');

export class Tests extends unit.TestClass {
	emitUpdateKElementCommand() {
		var counter = new Common.Counter();
		var win = new EditKElementWin.Win();
		var commandProcessor = new Commands.CommandProcessor();
		var controller = new EditKElementWin.Controller(win, commandProcessor);
		controller.setModel(new KonsenskisteModel.Model);
		
		commandProcessor.chain.insertAtBeginning(cmd => {
			if(cmd instanceof KElementCommands.UpdateGeneralContentCommand) {
				counter.inc('cmd');
				return true;
			}
			return false;
		});
		
		win.submitGeneralContent();
		
		test.assert(v => v.val(counter.get('cmd')) == 1);
	}
}