import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');
//import MainController = require('../controller');
import Windows = require('../windows');
import KokiLogic = require('../kokilogic');
import ctr = require('../topicnavigationcontroller')
import mdl = require('../topicnavigationmodel')
import vm = require('../topicnavigationviewmodel')
import Obs = require('../observable');
import Topic = require('../topic')
import TopicCommunicator = require('tests/testtopiccommunicator');
import ContentModel = require('../contentmodel');
import KonsenskisteModel = require('../konsenskistemodel');
import KonsenskisteViewModel = require('../konsenskisteviewmodel');
import Commands = require('../command');

export class Tests extends unit.TestClass {
	private topicFactory = new TopicFactory();

	breadcrumbMapping() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		model.history.push( this.topicFactory.create('root') );
		model.history.push( this.topicFactory.create('topic') );
		
		test.assert(() => viewModel.breadcrumb().length == 1);
		test.assert(() => viewModel.breadcrumb()[0].caption() == 'root');
		test.assert(() => viewModel.selected().caption() == 'topic');
	}
	
	children() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		test.assert(() => model.children.items.get() != null);
		
		model.children.items.push(new Topic.Model);
		model.children.items.get()[0].title('Child Title');
		
		test.assert(() => viewModel.children.items().length == 1);
	}
	
	kokis() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		test.assert(() => model.kokis.items.get() != null);
		
		model.kokis.items.push(new KonsenskisteModel.Model);
		model.kokis.items.get(0).general(new ContentModel.General);
		model.kokis.items.get(0).general().title('KoKi Title');
		
		test.assert(() => viewModel.kokis.items().length == 1);
		test.assert(() => viewModel.kokis.items()[0].caption() == 'KoKi Title');
	}
	
	getFromCommunicator() {
		var counter = new common.Counter();
		var model = new mdl.ModelImpl();
		model.history.push(new Topic.Model);
		model.selectedTopic().id = { id: 3 };
		var communicator = new TopicCommunicator.Main();
		var controller = new ctr.ModelCommunicatorController(model, communicator);
		
		communicator.queryChildren = (id, out) => {
			counter.inc('queryChildren');
			test.assert(v => out == model.children);
		};
		communicator.queryContainedKokis = (id, out) => {
			counter.inc('queryContainedKokis');
			test.assert(v => out == model.kokis);
		};
		
		model.selectChild(new Topic.Model);
		
		test.assert(v => v.val(counter.get('queryChildren')) == 1);
		test.assert(v => v.val(counter.get('queryContainedKokis')) == 1);
	}
	
	queriesWhenSelectedTopicChanged() {
		var counter = new common.Counter();
		var model = new mdl.ModelImpl();
		var communicator = new TopicCommunicator.Stub();
		var controller = new ctr.ModelCommunicatorController(model, communicator);
		
		communicator.queryChildren = () => counter.inc('queryChildren');
		communicator.queryContainedKokis = () => counter.inc('queryContainedKokis');
		
		var topic = new Topic.Model;
		topic.id = { id: 13 };
		model.history.push(topic);
		
		test.assert(() => counter.get('queryChildren') == 1);
		test.assert(() => counter.get('queryContainedKokis') == 1);
	}
	
	clickChild() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		model.history.push(new Topic.Model);
		model.children.items.set([new Topic.Model]);
		model.children.items.get(0).title('Child');
		
		viewModel.children.items()[0].click();
		
		test.assert(() => model.history.get().length == 2);
		test.assert(() => model.children.items.get().length == 0);
		test.assert(() => model.selectedTopic().title() == 'Child');
	}
	
	clickKoki() {
		var counter = new common.Counter();
		var commandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor };
		commandControl.commandProcessor.chain.append(cmd => {
			counter.inc('command');
			test.assert(() => cmd instanceof KokiLogic.SelectAndLoadKokiCommand);
			var castCmd = <KokiLogic.SelectAndLoadKokiCommand>cmd;
			test.assert(() => castCmd.id == 3);
			return true;
		});
		
		var kokiModel = new KonsenskisteModel.Model(); kokiModel.id(3);
		var kokiViewModel = new vm.KokiItem();
		var kokiController = new ctr.KokiItemViewModelController(kokiModel, kokiViewModel, commandControl);
		
		kokiViewModel.click();
		
		test.assert(() => counter.get('command') == 1);
	}
	
	receiveCommandToSelectKoki() {
		var counter = new common.Counter();
		var commandProcessor: Commands.CommandProcessor = new Commands.CommandProcessor;
		commandProcessor.chain.append(cmd => {
			counter.inc('command');
			test.assert(() => cmd instanceof KokiLogic.SelectAndLoadKokiCommand);
			var castCmd = <KokiLogic.SelectAndLoadKokiCommand>cmd;
			test.assert(() => castCmd.id == 3);
			return true;
		});
		
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel, commandProcessor);
		
		var cmd = new KokiLogic.SelectAndLoadKokiCommand(3);
		controller.kokiCommandControl.commandProcessor.processCommand(cmd);
		
		test.assert(() => counter.get('command') == 1);
	}
	
	clickBreadcrumbTopic() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		model.history.push(new Topic.Model); model.history.get(0).title('Parent');
		model.history.push(new Topic.Model);
		
		viewModel.breadcrumb()[0].click();
		
		test.assert(() => model.history.get().length == 1);
		test.assert(() => model.selectedTopic().title() == 'Parent');
	}
	
	root() {
		var model = new mdl.ModelImpl();
		var communicator = new TopicCommunicator.Stub();
		var controller = new ctr.ModelCommunicatorController(model, communicator);
		
		var queryCtr = 0;
		communicator.queryChildren = id => {
			++queryCtr;
		};
		
		var topic = new Topic.Model();
		topic.id = { id: null, root: true };
		model.history.push(topic);
		
		test.assert(() => queryCtr == 1);
	}
	
	newKoki() {
		var counter = new common.Counter();
		var commandProcessor = new Commands.CommandProcessor();
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel, commandProcessor);
		
		var topic = new Topic.Model();
		topic.title('Parent Topic wr,s');
		model.history.push(topic);
		
		commandProcessor.chain.append(cmd => {
			if(cmd instanceof Windows.OpenNewKokiWindowCommand) {
				counter.inc('openNewKokiWindow command');
				var openNewKokiWindow = <Windows.OpenNewKokiWindowCommand>cmd;
				test.assert(v => v.val(openNewKokiWindow.topic.title()) == 'Parent Topic wr,s');
				return true;
			}
			return false;
		});
		
		viewModel.clickCreateNewKoki();
		
		test.assert(v => v.val(counter.get('openNewKokiWindow command')) == 1);
	}
}


class TopicFactory {
	public create(title: string) {
		var topic = new Topic.Model();
		topic.title(title);
		return topic;
	}
}