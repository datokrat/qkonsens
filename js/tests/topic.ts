import unit = require('tests/tsunit');
import test = require('tests/test');
import Topic = require('../topic');
import TopicCommunicator = require('../topiccommunicatorimpl');

export class Tests extends unit.TestClass {
	properties() {
		var model = new Topic.Model();
		var viewModel = new Topic.ViewModel();
		var controller = new Topic.ChildController(model, viewModel);
		
		model.title('Parent Title');
		model.text('Parent Text');
		
		test.assert(() => viewModel.caption() == 'Parent Title');
		test.assert(() => viewModel.description() == 'Parent Text');
		
		viewModel.click.raise();
	}
	
	/*topicFromCommunicator() {
		var model = new Topic.ExtendedModel();
		var viewModel = new Topic.ParentViewModel();
		var communicator = new TopicCommunicator.Main();
		var controller = new Topic.ParentController(model, viewModel, communicator);
		
		model.properties().id = 6;
		
		var receivedModel = new Topic.ExtendedModel();
		receivedModel.properties().id = 6;
		receivedModel.properties().title('Topic Title');
		communicator.extendedTopicReceived.raise({ topic: receivedModel });
		
		test.assert(() => model.properties().title() == 'Topic Title');
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