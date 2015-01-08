import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');

import frame = require('../frame');
import Commands = require('../command');

import TopicLogic = require('../topiclogic');
import TopicNavigationModel = require('../topicnavigationmodel');
import TopicCommunicator = require('tests/testtopiccommunicator');
import WindowViewModel = require('../windowviewmodel');

export class Tests extends unit.TestClass {
	setUp() {
		this.counter = new common.Counter();
	}
	
	isRootTopicSelected() {
		var resources = ResourceInitializer.createResources();
		var topicLogic = new TopicLogic.Controller(resources);
		
		test.assert(v => resources.topicNavigationModel.selectedTopic().id.root == true);
	}
	
	private counter: common.Counter;
}

class ResourceInitializer {
	public static createResources(): TopicLogic.Resources {
		var ret = new TopicLogic.Resources();
		ret.topicNavigationModel = new TopicNavigationModel.ModelImpl();
		ret.topicCommunicator = new TopicCommunicator.Stub();
		ret.windowViewModel = ResourceInitializer.createWindowViewModel();
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

class Mocks {
	public static counter(counter: common.Counter, key: string) {
		return () => counter.inc(key);
	}
}