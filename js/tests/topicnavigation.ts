import unit = require('tests/tsunit');
import test = require('tests/test');
import ctr = require('../topicnavigationcontroller')
import mdl = require('../topicnavigationmodel')
import vm = require('../topicnavigationviewmodel')
import Obs = require('../observable');
import Topic = require('../topic')
import TopicCommunicator = require('tests/testtopiccommunicator');

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
	
	getChildrenFromCommunicator() {
		var model = new mdl.ModelImpl();
		model.history.push(new Topic.Model);
		model.selectedTopic().id = { id: 3 };
		var communicator = new TopicCommunicator.Main();
		var controller = new ctr.ModelCommunicatorController(model, communicator);
		
		communicator.childrenReceived.raise({ id: { id: 3 }, children: [new Topic.Model] });
		
		test.assert(() => model.children.get().length == 1);
	}
	
	queryChildrenWhenSelectedTopicChanged() {
		var model = new mdl.ModelImpl();
		var communicator = new TopicCommunicator.Stub();
		var controller = new ctr.ModelCommunicatorController(model, communicator);
		
		var queryCtr = 0;
		communicator.queryChildren = () => ++queryCtr;
		
		var topic = new Topic.Model;
		topic.id = { id: 13 };
		model.history.push(topic);
		
		test.assert(() => queryCtr == 1);
	}
	
	clickChild() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		model.history.push(new Topic.Model);
		model.children.set([new Topic.Model]);
		model.children.get(0).title('Child');
		
		viewModel.children()[0].click.raise();
		
		test.assert(() => model.history.get().length == 2);
		test.assert(() => model.children.get().length == 0);
		test.assert(() => model.selectedTopic().title() == 'Child');
	}
	
	clickBreadcrumbTopic() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ModelViewModelController(model, viewModel);
		
		model.history.push(new Topic.Model); model.history.get(0).title('Parent');
		model.history.push(new Topic.Model);
		
		viewModel.breadcrumb()[0].click.raise();
		
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
		
		var topic = new Topic.Model();
		topic.id = { id: null, root: true };
		model.history.push(topic);
	}
}


class TopicFactory {
	public create(title: string) {
		var topic = new Topic.Model();
		topic.title(title);
		return topic;
	}
}