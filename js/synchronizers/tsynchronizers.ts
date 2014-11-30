import Factory = require('factories/constructorbased');
import Sync = require('synchronizers/childarraysynchronizer');
import Topic = require('../topic');

export class TopicViewModelSync extends Sync.ObservingChildArraySynchronizer<Topic.Model, Topic.ViewModel, Topic.ModelViewModelController> {
	constructor() {
		super();
		this.fty = new ModelViewModelControllerFactory();
		
		this.setViewModelFactory(new Factory.Factory(Topic.ViewModel));
		this.setControllerFactory(this.fty);
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

/*class ModelCommunicatorControllerFactory {
	public create(model: Topic.Model, communicator: Topic.Communicator)
}*/

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