import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');

import frame = require('../frame');
import Commands = require('../command');

import Controller = require('../controller');
import KonsenskisteModel = require('../konsenskistemodel');
import KonsenskisteCommunicator = require('tests/testkonsenskistecommunicator');

import KonsenskisteWin = require('windows/konsenskiste');
import KonsenskisteWinController = require('windows/konsenskistecontroller');
import WindowViewModel = require('../windowviewmodel');

import KokiLogic = require('../kokilogic');
import StateLogic = require('../statelogic');
import AccountLogic = require('../accountlogic');

export class Tests extends unit.TestClass {
	setUp() {
		this.counter = new common.Counter();
	}
	
	windowPlacement() {
		var resources = ResourceInitializer.createResources();
		var kokiLogic = new KokiLogic.Controller(resources);
		
		test.assert(v => resources.windowViewModel.getWindowOfFrame(WindowViewModel.Frame.Center) 
			instanceof KonsenskisteWin.Win);
	}
	
	processSelectAndLoadKokiCommand() {
		var resources = ResourceInitializer.createResources();
		resources.konsenskisteCommunicator.query = (id: number) => {
			this.counter.inc('query');
			return new KonsenskisteModel.Model();
		};
		var kokiLogic = new KokiLogic.Controller(resources);
		
		kokiLogic.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(0));
		
		test.assert(v => v.val(this.counter.get('query')) == 1);
	}
	
	processSetKokiCommand() {
		var resources = ResourceInitializer.createResources();
		resources.konsenskisteWinControllerFactory = { create: () => {
			var ret = new KokiWinControllerStub();
			ret.setKonsenskisteModel = (model: KonsenskisteModel.Model) => this.counter.inc('setKonsenskisteModel');
			return ret;
		} };
		var kokiLogic = new KokiLogic.Controller(resources);
		
		kokiLogic.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(new KonsenskisteModel.Model));
		
		test.assert(v => v.val(this.counter.get('setKonsenskisteModel')) == 1);
	}
	
	/*TODO Move CreateNewKokiCommand from controller.ts!!!
	processCreateNewKokiCommand() {
		var resources = ResourceInitializer.createResources();
		resources.konsenskisteCommunicator.create = (koki, topicId, then) => {
			this.counter.inc('communicator.create');
			then(3);
		}
		var kokiLogic = new KokiLogic.Controller(resources);
		
		kokiLogic.commandProcessor.processCommand(new KokiLogic.CreateNewKokiCommand(new KonsenskisteModel.Model, 3,
			() => this.counter.inc('then')));
		
		test.assert(v => v.val(this.counter.get('communicator.create')) == 1);
		test.assert(v => v.val(this.counter.get('then')) == 1);
	}*/
	
	processHandleChangedAccountCommand() {
		var resources = ResourceInitializer.createResources();
		var kokiLogic = new KokiLogic.Controller(resources);
		
		resources.konsenskisteCommunicator.query = () => {
			this.counter.inc('query');
			return new KonsenskisteModel.Model();
		};
		
		resources.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(new KonsenskisteModel.Model()));
		resources.commandProcessor.processCommand(new AccountLogic.HandleChangedAccountCommand());
		
		test.assert(v => v.val(this.counter.get('query')) == 1);
	}
	
	sendHandleChangedKokiWinStateCommand() {
		var resources = ResourceInitializer.createResources();
		var kokiLogic = new KokiLogic.Controller(resources);
		
		resources.commandProcessor.chain.append(cmd => {
			this.counter.inc('cmd');
			test.assert(v => cmd instanceof KokiLogic.HandleChangedKokiWinStateCommand);
			return true;
		});
		
		var koki = new KonsenskisteModel.Model();
		koki.id(3);
		kokiLogic.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(koki));
		
		test.assert(v => v.val(this.counter.get('cmd')) == 1);
	}
	
	processChangeKokiStateCommand() {
		var resources = ResourceInitializer.createResources();
		var kokiLogic = new KokiLogic.Controller(resources);
		
		var state = { kokiId: 19 };
		resources.konsenskisteCommunicator.query = id => {
			this.counter.inc('query');
			return new KonsenskisteModel.Model();
		};
		kokiLogic.commandProcessor.processCommand(new StateLogic.ChangeKokiStateCommand(state));
		
		test.assert(v => v.val(this.counter.get('query')) == 1);
	}
	
	passUnknownCommandFromChildToParent() {
		var resources = ResourceInitializer.createResources();
		var kokiLogic = new KokiLogic.Controller(resources);
		var command = {};
		
		resources.commandProcessor.chain.append(cmd => {
			this.counter.inc('cmd');
			test.assert(v => cmd == command);
			return true;
		});
		
		kokiLogic['internalCommandProcessor'].processCommand(command);
		
		test.assert(v => v.val(this.counter.get('cmd')) == 1);
	}
	
	private counter: common.Counter;
}


class ResourceInitializer {
	public static createResources(): KokiLogic.Resources {
		var ret = new KokiLogic.Resources();
		ret.windowViewModel = ResourceInitializer.createWindowViewModel();
		ret.konsenskisteCommunicator = new KonsenskisteCommunicator.Stub();
		ret.commandProcessor = new Commands.CommandProcessor();
		return ret;
	}
	
	private static createWindowViewModel(): WindowViewModel.Main {
		return new WindowViewModel.Main({
			center: ResourceInitializer.createWinContainer(),
			left: ResourceInitializer.createWinContainer(),
			right: ResourceInitializer.createWinContainer(),
		});
	}
	
	private static createWinContainer(): frame.WinContainer {
		return new frame.WinContainer(new frame.Win('', null));
	}
}

class KokiWinControllerStub implements KonsenskisteWinController.Controller {
	public setKonsenskisteModelById(id: number) {}
	public setKonsenskisteModel(model: KonsenskisteModel.Model) {}
	public dispose() {}
}