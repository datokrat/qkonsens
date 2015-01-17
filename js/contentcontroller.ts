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
		if(this.model.postId == args.general.postId)
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
	constructor( model: Model.Context, viewModel: ViewModel.Context, communicator: Communicator.Main ) {
		this.model = model;
		this.viewModel = viewModel;
		
		this.viewModel.text = ko.computed( () => model.text() );
		this.viewModel.isVisible = ko.observable<boolean>(false);
		
		this.viewModel.toggleVisibility = new Events.EventImpl<Events.Void>();
		this.viewModel.toggleVisibility.subscribe( () => this.toggleVisibility() );
		
		this.communicator = communicator;
		this.communicator.contextRetrieved.subscribe(this.onUpdateRetrieved);
	}
	
	private onUpdateRetrieved = (args: Communicator.ContextRetrievedArgs) => {
		if(this.model.id == args.context.id)
			this.model.set(args.context);
	}
	
	private toggleVisibility() {
		var isVisible = this.viewModel.isVisible();
		this.viewModel.isVisible( !isVisible );
	}
	
	public dispose() {
		this.viewModel.text.dispose();
		this.communicator.contextRetrieved.unsubscribe(this.onUpdateRetrieved);
	}
	
	private model: Model.Context;
	private viewModel: ViewModel.Context;
	private communicator: Communicator.Main;
}