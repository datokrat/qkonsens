import unit = require('tests/tsunit');
import test = require('tests/test');
import Topic = require('../topic');
import TopicCommunicator = require('tests/testtopiccommunicator');

export class Tests extends unit.TestClass {
	properties() {
		var model = new Topic.Model();
		var viewModel = new Topic.ViewModel();
		var controller = new Topic.ModelViewModelController(model, viewModel);
		
		model.title('Parent Title');
		model.text('Parent Text');
		
		test.assert(() => viewModel.caption() == 'Parent Title');
		test.assert(() => viewModel.description() == 'Parent Text');
		
		viewModel.click();
	}
	
	/*childrenFromCommunicator() {
		var queryCtr = 0;
		var model = new Topic.Model();
		var viewModel = new Topic.ViewModel();
		var communicator = new TopicCommunicator.Stub();
		var controller = new Topic.Controller(model, viewModel, communicator);
		
		communicator.queryChildren = id => {
			++queryCtr;
		};
		
		model.id = { id: 6 };
		
		var receivedModel = new Topic.Model();
		receivedModel.id = { id: 6 };
		receivedModel.title('Topic Title');
		//communicator.childrenReceived.raise({ id: { id: 6 }, children: receivedModel });
		
		test.assert(() => queryCtr == 1);
	}*/
	
	/*clickChildTopic() {
		var model = new Topic.ExtendedModel();
		var viewModel = new Topic.ParentViewModel();
		var communicator = new TopicCommunicator.Main();
		var controller = new Topic.ParentController(model, viewModel, communicator);
		
		model.children.push(new Topic.Model);
		model.children.get(0).id = 7;
		
		var serverModel = new Topic.ExtendedModel();
		serverModel.properties().id = 7;
		serverModel.properties().title('Topic 7');
		communicator.setTestTopic(serverModel);
		
		viewModel.children()[0].click();
		
		test.assert(() => model.properties().title
	}*/
}