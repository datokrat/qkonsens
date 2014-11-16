import Factory = require('factories/constructorbased');
import Sync = require('synchronizers/childarraysynchronizer');
import Topic = require('../topic');

export class ChildTopicSync extends Sync.ObservingChildArraySynchronizer<Topic.Model, Topic.ChildViewModel, Topic.ChildController> {
	constructor() {
		super();
		this.setViewModelFactory(new Factory.Factory(Topic.ChildViewModel));
		this.setControllerFactory(new Factory.ControllerFactory(Topic.ChildController));
	}
}