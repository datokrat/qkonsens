import Factory = require('factories/constructorbased');
import Sync = require('synchronizers/childarraysynchronizer');
import Topic = require('../topic');
import ContentModel = require('../contentmodel');
import TopicNavigationViewModel = require('../topicnavigationviewmodel');
import TopicNavigationController = require('../topicnavigationcontroller');
import Commands = require('../command');

export class TopicViewModelSync extends Sync.ObservingChildArraySynchronizer<Topic.Model, Topic.ViewModel, Topic.ModelViewModelController> {
	constructor(args: { commandControl: Commands.CommandControl }) {
		super();
		this.fty = new ModelViewModelControllerFactory();
		
		this.setViewModelFactory(new Factory.Factory(Topic.ViewModel));
		this.setControllerFactory(new Factory.ControllerFactoryEx(Topic.ModelViewModelController, args.commandControl));
	}
	
	private fty: ModelViewModelControllerFactory;
}

export class TopicCommunicatorSync extends Sync.PureModelArraySynchronizer<Topic.Model, Topic.ModelCommunicatorController> {
	constructor() {
		super();
	}
	
	public setCommunicator(communicator: Topic.Communicator) {
		this.setControllerFactory(new ModelCommunicatorControllerFactory(communicator));
	}
}

export class KokiItemViewModelSync extends Sync.ObservingChildArraySynchronizer<ContentModel.General, TopicNavigationViewModel.KokiItem, TopicNavigationController.KokiItemViewModelController> {
	constructor() {
		super();
		this.setViewModelFactory(new Factory.Factory(TopicNavigationViewModel.KokiItem));
		this.setControllerFactory(new Factory.ControllerFactory(TopicNavigationController.KokiItemViewModelController));
	}
}

class ModelCommunicatorControllerFactory {
	constructor(communicator: Topic.Communicator) {
		this.communicator = communicator;
	}
	
	public create(model: Topic.Model) {
		return new Topic.ModelCommunicatorController(model, this.communicator);
	}
	
	private communicator: Topic.Communicator;
}

class ModelViewModelControllerFactory {
	public create(model: Topic.Model, viewModel: Topic.ViewModel) {
		return new Topic.ModelViewModelController(model, viewModel);
	}
}

class ControllerFactory {
	public create(model: Topic.Model, viewModel: Topic.ViewModel): Topic.Controller {
		if(this.communicator == null) throw new Error('this.communicator is null');
		return new Topic.Controller(model, viewModel, this.communicator);
	}
	
	public setCommunicator(communicator: Topic.Communicator) {
		this.communicator = communicator;
	}
	
	private communicator: Topic.Communicator;
}