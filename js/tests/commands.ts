import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');

import TopicNavigationModel = require('../topicnavigationmodel');
import TopicNavigationViewModel = require('../topicnavigationviewmodel');
import TopicNavigationController = require('../topicnavigationcontroller');
import TopicCommunicator = require('tests/testtopiccommunicator');
import KonsenskisteModel = require('../konsenskistemodel');

import Controller = require('../controller');
import Model = require('../model');
import ViewModel = require('../viewmodel');
import Communicator = require('tests/testcommunicator');

import Commands = require('../command');

export class Main extends unit.TestClass {
	/*sendCommandFromKokiItemToController() {
		var counter = new common.Counter();
		var commandControl = { commandProcessor: new Commands.CommandProcessor() };
		commandControl.commandProcessor.chain.append(cmd => {
			counter.inc('command');
			return true;
		});
		
		var model = new Model.ModelImpl();
		var viewModel = new ViewModel.ViewModel();
		var communicator = new Communicator();
		var controller = new Controller.Controller(model, viewModel, communicator, commandControl);
		model.topicNavigation.kokis.push(new KonsenskisteModel.Model);
		viewModel.browseWin.navigation().kokis()[0].click();
		
		test.assert(() => counter.get('command') == 1);
	}*/
}