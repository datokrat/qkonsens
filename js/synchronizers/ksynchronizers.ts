import Base = require('synchronizers/childsynchronizer')
import Factories = require('factories/constructorbased')
import ContentViewModel = require('../contentviewmodel')
import ContentModel = require('../contentmodel')
import ContentController = require('../contentcontroller')
import ContentCommunicator = require('../contentcommunicator')
import Rating = require('../rating')
import Discussion = require('../discussion')
import DiscussionCommunicator = require('../discussablecommunicator')
import ViewModelContext = require('../viewmodelcontext')

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

export class DiscussionSynchronizer
	extends Base.ChildSynchronizer<Discussion.Model, Discussion.ViewModel, Discussion.Controller>
{
	constructor(communicator: DiscussionCommunicator.Base) {
		super();
		this.setViewModelFactory( new Factories.Factory(Discussion.ViewModel) );
		
		this.controllerFty = new DiscussionControllerFactory(communicator);
		this.setControllerFactory( this.controllerFty );
	}
    
    public setViewModelContext(cxt: ViewModelContext) {
        this.controllerFty.setViewModelContext(cxt);
		this.controller && this.controller.setViewModelContext(cxt);
		return this;
    }
	
	public setDiscussableModel(m: Discussion.DiscussableModel) {
		this.controllerFty.setDiscussableModel(m);
		this.controller && this.controller.setDiscussableModel(m);
		return this;
	}
	
	public setDiscussableViewModel(v: Discussion.DiscussableViewModel) {
		this.controllerFty.setDiscussableViewModel(v);
		this.controller && this.controller.setDiscussableViewModel(v);
		return this;
	}
	
	private controllerFty: DiscussionControllerFactory;
}

class DiscussionControllerFactory {
	constructor(communicator: DiscussionCommunicator.Base) {
		this.communicator = communicator;
	}
	
	public create(model: Discussion.Model, viewModel: Discussion.ViewModel) {
		var ret = new Discussion.Controller(model, viewModel, this.communicator);
		ret.setDiscussableModel(this.discussableModel);
		ret.setDiscussableViewModel(this.discussableViewModel);
        ret.setViewModelContext(this.viewModelContext);
		return ret;
	}
    
    public setViewModelContext(cxt: ViewModelContext) {
        this.viewModelContext = cxt;
    }
	
	public setDiscussableModel(m: Discussion.DiscussableModel) {
		this.discussableModel = m;
	}
	
	public setDiscussableViewModel(v: Discussion.DiscussableViewModel) {
		this.discussableViewModel = v;
	}

	private communicator: DiscussionCommunicator.Base;
    private viewModelContext: ViewModelContext;
	
	private discussableModel: Discussion.DiscussableModel;
	private discussableViewModel: Discussion.DiscussableViewModel;
}