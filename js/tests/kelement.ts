import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');
import KElement = require('../kelement');
import Commands = require('../command');
import Rating = require('../rating');
import KokiCommunicator = require('tests/testkonsenskistecommunicator');
import KElementCommands = require('../kelementcommands');

export class Main {
	processSubmitRatingCommand() {
		var counter = new common.Counter();
		var kModel = new KElement.Model(); kModel.id(6);
		var kViewModel = new KElement.ViewModel();
		var kCommunicator = new KokiCommunicator.Stub();
		var kController = new KElement.Controller(kModel, kViewModel, kCommunicator, null);
		
		kCommunicator.rating.submitRating = (ratableId: number, rating: string, then?: () => void) => {
			counter.inc('submitRating');
			test.assert(() => ratableId == 6);
			test.assert(() => rating == 'stronglike');
			test.assert(() => counter.get('then') == 0);
			then && then();
			test.assert(() => counter.get('then') == 1);
		}
		
		var cmd = new Rating.SelectRatingCommand('stronglike', () => counter.inc('then'));
		kController.commandProcessor.processCommand(cmd);
		
		test.assert(() => counter.get('submitRating') == 1);
		test.assert(() => counter.get('then') == 1);
	}
	
	edit() {
		var counter = new common.Counter();
		var kModel = new KElement.Model(); kModel.id(6);
		var kViewModel = new KElement.ViewModel();
		var kCommunicator = new KokiCommunicator.Stub();
		var commandProcessor = new Commands.CommandProcessor();
		var kController = new KElement.Controller(kModel, kViewModel, kCommunicator, commandProcessor);
		
		commandProcessor.chain.insertAtBeginning(cmd => {
			if(cmd instanceof KElementCommands.OpenEditKElementWindowCommand) {
				counter.inc('cmd');
				test.assert(v => v.val((<KElementCommands.OpenEditKElementWindowCommand>cmd).model.id()) == 6);
				return true;
			}
			return false;
		});
		
		kViewModel.editClick();
		
		test.assert(v => v.val(counter.get('cmd')) == 1);
	}
}