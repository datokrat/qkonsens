import Base = require('synchronizers/childarraysynchronizer')
import Factories = require('factories/constructorbased')
import Events = require('../event')
import Obs = require('../observable')
import Comment = require('../comment')
import ContentCommunicator = require('../contentcommunicator')

class Synchronizer extends Base.ObservingChildArraySynchronizer<Comment.Model, Comment.ViewModel, Comment.Controller> {
	constructor(communicator: ContentCommunicator.Main) {
		super();
		this.setViewModelFactory( new Factories.Factory(Comment.ViewModel) );
		this.setControllerFactory( new Factories.ControllerFactoryEx(Comment.Controller, communicator) );
	}
}

export = Synchronizer;