import Base = require('synchronizers/childsynchronizer')
import Factories = require('factories/constructorbased')
import ContentViewModel = require('../contentviewmodel')
import ContentModel = require('../contentmodel')
import ContentController = require('../contentcontroller')
import ContentCommunicator = require('../contentcommunicator')
import Rating = require('../rating')

export class GeneralContentSynchronizer 
	extends Base.ChildSynchronizer<ContentModel.General, ContentViewModel.General, ContentController.General>
{
	constructor(communicator: ContentCommunicator.Main) {
		super();
		this.setViewModelFactory( new Factories.Factory(ContentViewModel.General) );
		this.setControllerFactory( new Factories.ControllerFactoryEx(ContentController.General, communicator) );
	}
}

export class ContextSynchronizer 
	extends Base.ChildSynchronizer<ContentModel.Context, ContentViewModel.Context, ContentController.Context>
{
	constructor(communicator: ContentCommunicator.Main) {
		super();
		this.setViewModelFactory( new Factories.Factory(ContentViewModel.Context) );
		this.setControllerFactory( new Factories.ControllerFactoryEx(ContentController.Context, communicator) );
	}
}

export class RatingSynchronizer
	extends Base.ChildSynchronizer<Rating.Model, Rating.ViewModel, Rating.Controller>
{
	constructor() {
		super();
		this.setViewModelFactory( new Factories.Factory(Rating.ViewModel) );
		this.setControllerFactory( new Factories.ControllerFactory(Rating.Controller) );
	}
}