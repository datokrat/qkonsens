import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');
import KElement = require('../kelement');
import Commands = require('../command');
import Rating = require('../rating');
import KokiCommunicator = require('tests/testkonsenskistecommunicator');

export class Main {
	processSubmitRatingCommand() {
		var counter = new common.Counter();
		var kModel = new KElement.Model(); kModel.id(6);
		var kViewModel = new KElement.ViewModel();
		var kCommunicator = new KokiCommunicator.Stub();
		var kController = new KElement.Controller(kModel, kViewModel, kCommunicator);
		
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
}