import observable = require('observable')
import Events = require('event')

import Model = require('contentmodel')
import ViewModel = require('contentviewmodel')
import Communicator = require('contentcommunicator')

import ContextViewModel = require('contextviewmodel')
import ContextModel = require('contextmodel')
import ContextController = require('contextcontroller')

export class General {
	constructor(model: Model.General, viewModel: ViewModel.General, communicator: Communicator.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: Model.General, viewModel: ViewModel.General, communicator: Communicator.Main) {
		this.viewModel = viewModel;
		this.model = model;
		this.communicator = communicator;
		
		this.viewModel.title = ko.computed( () => model.title() );
		this.viewModel.text = ko.computed( () => model.text() );
		
		this.communicator.generalContentRetrieved.subscribe(this.onContentRetrieved);
	}
	
	private onContentRetrieved = (args: Communicator.GeneralContentRetrievedArgs) => {
		if(this.model.id == args.general.id)
			this.model.set(args.general);
	}
	
	public dispose() {
		this.viewModel.title.dispose();
		this.viewModel.text.dispose();
		this.communicator.generalContentRetrieved.unsubscribe(this.onContentRetrieved);
	}
	
	private viewModel: ViewModel.General;
	private model: Model.General;
	private communicator: Communicator.Main;
}

export class Context {
	constructor( model: Model.Context, viewModel: ViewModel.Context ) {
		this.viewModel = viewModel;
		
		this.viewModel.text = ko.computed( () => model.text() );
		this.viewModel.isVisible = ko.observable<boolean>(false);
		
		this.viewModel.toggleVisibility = new Events.EventImpl<Events.Void>();
		this.viewModel.toggleVisibility.subscribe( () => this.toggleVisibility() );
	}
	
	private toggleVisibility() {
		var isVisible = this.viewModel.isVisible();
		this.viewModel.isVisible( !isVisible );
	}
	
	public dispose() {
		this.viewModel.text.dispose();
	}
	
	private viewModel: ViewModel.Context;
}

/*export class WithContext extends Controller {
	constructor(model: mdl.WithContext, viewModel: vm.WithContext, communicator: Communicator.Main) {
		super(model, viewModel, communicator);
		this.initContext(model, viewModel);
	}
	
	private initContext(model: mdl.WithContext, viewModel: vm.WithContext) {
		this.viewModelWithContext = viewModel;
		this.modelWithContext = model;
		
		this.viewModelWithContext.context = ko.observable<ContextViewModel>( new ContextViewModel );
		
		var contextModel = this.modelWithContext.context();
		var contextViewModel = this.viewModelWithContext.context();
		var contextController = new ContextController( contextModel, contextViewModel );
		
		this.context = contextController;
	}
	
	public dispose() {
		Controller.prototype.dispose.apply(this, arguments);
		
		this.context.dispose();
	}
	
	private viewModelWithContext: vm.WithContext;
	private modelWithContext: mdl.WithContext;
	
	private context: ContextController;
}*/