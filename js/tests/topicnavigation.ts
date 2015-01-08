import unit = require('tests/tsunit');
import test = require('tests/test');
import common = require('../common');
import MainController = require('../controller');
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
		
		test.assert(() => model.children.get() != null);
		
		model.children.push(new Topic.Model);
		model.children.get()[0].title('Child Title');
		
		test.assert(() => viewModel.children().length == 1);
	}
	
	kokis() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		test.assert(() => model.kokis.get() != null);
		
		model.kokis.push(new KonsenskisteModel.Model);
		model.kokis.get(0).general(new ContentModel.General);
		model.kokis.get(0).general().title('KoKi Title');
		
		test.assert(() => viewModel.kokis().length == 1);
		test.assert(() => viewModel.kokis()[0].caption() == 'KoKi Title');
	}
	
	getFromCommunicator() {
		var model = new mdl.ModelImpl();
		model.history.push(new Topic.Model);
		model.selectedTopic().id = { id: 3 };
		var communicator = new TopicCommunicator.Main();
		var controller = new ctr.ModelCommunicatorController(model, communicator);
		
		communicator.childrenReceived.raise({ id: { id: 3 }, children: [new Topic.Model] });
		communicator.containedKokisReceived.raise({ id: { id: 3 }, kokis: [new KonsenskisteModel.Model] });
		
		test.assert(() => model.children.get().length == 1);
		test.assert(v => v.val(model.kokis.get().length) == 1);
		
		//Wrong id - should be ignored
		communicator.containedKokisReceived.raise({ id: { id: 2 }, kokis: [] });
		communicator.childrenReceived.raise({ id: { id: 2 }, children: [] });
		
		test.assert(v => v.val(model.children.get().length) == 1);
		test.assert(v => v.val(model.kokis.get().length) == 1);
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
		model.children.set([new Topic.Model]);
		model.children.get(0).title('Child');
		
		viewModel.children()[0].click();
		
		test.assert(() => model.history.get().length == 2);
		test.assert(() => model.children.get().length == 0);
		test.assert(() => model.selectedTopic().title() == 'Child');
	}
	
	clickKoki() {
		var counter = new common.Counter();
		var commandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor };
		commandControl.commandProcessor.chain.append(cmd => {
			counter.inc('command');
			test.assert(() => cmd instanceof MainController.SelectKokiCommand);
			var castCmd = <MainController.SelectKokiCommand>cmd;
			test.assert(() => castCmd.model.id() == 3);
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
			test.assert(() => cmd instanceof MainController.SelectKokiCommand);
			var castCmd = <MainController.SelectKokiCommand>cmd;
			test.assert(() => castCmd.model.id() == 3);
			return true;
		});
		
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel, commandProcessor);
		var kokiModel = new KonsenskisteModel.Model(); kokiModel.id(3);
		var kokiViewModel = new vm.KokiItem();
		
		var cmd = new MainController.SelectKokiCommand(kokiModel);
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
	
	parentTopicArray() {
		var pushCtr = 0, removeCtr = 0, changeCtr = 0;
		var arr = new mdl.ParentTopicArray();
		arr.pushed.subscribe(() => ++pushCtr);
		arr.removed.subscribe(() => ++removeCtr);
		arr.changed.subscribe(() => ++changeCtr);
		
		var hst = new Obs.ObservableArrayExtender(ko.observableArray([]));
		arr.setHistory(hst);
		
		test.assert(() => changeCtr == 1);
		test.assert(() => pushCtr == 0);
		test.assert(() => removeCtr == 0);
		
		pushCtr = 0, removeCtr = 0, changeCtr = 0;
		hst.push(new Topic.Model);
		
		test.assert(() => changeCtr == 0);
		test.assert(() => pushCtr == 0);
		test.assert(() => removeCtr == 0);
		
		pushCtr = 0, removeCtr = 0, changeCtr = 0;
		hst.push(new Topic.Model);
		
		test.assert(() => changeCtr == 0);
		test.assert(() => pushCtr == 1);
		test.assert(() => removeCtr == 0);
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
			if(cmd instanceof MainController.OpenNewKokiWindowCommand) {
				counter.inc('openNewKokiWindow command');
				var openNewKokiWindow = <MainController.OpenNewKokiWindowCommand>cmd;
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