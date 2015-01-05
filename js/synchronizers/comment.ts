import Base = require('synchronizers/childarraysynchronizer')
import Factories = require('factories/constructorbased')
import Events = require('../event')
import Obs = require('../observable')
import Comment = require('../comment')
import DiscussionCommunicator = require('../discussioncommunicator')

class Synchronizer extends Base.ObservingChildArraySynchronizer<Comment.Model, Comment.ViewModel, Comment.Controller> {
	constructor(communicator: DiscussionCommunicator.Base) {
		super();
		this.setViewModelFactory( new Factories.Factory(Comment.ViewModel) );
		this.setControllerFactory(
			new Factories.ControllerFactoryEx<Comment.Model, Comment.ViewModel, DiscussionCommunicator.Base, Comment.Controller>
				(Comment.Controller, communicator) );
	}
}

export = Synchronizer;