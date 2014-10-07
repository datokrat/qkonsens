import observable = require('observable')

import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')
import com = require('kernaussagecommunicator')
import ViewModelContext = require('viewmodelcontext')

import KSync = require('synchronizers/ksynchronizers')
import Discussable = require('discussable')

import ContentController = require('contentcontroller')
import ContentViewModel = require('contentviewmodel')

export class Controller {
	private viewModel: vm.ViewModel;
	private generalContentSynchronizer: KSync.GeneralContentSynchronizer;
	private context: ContentController.Context; //TODO: Synchronizer
	private discussable: Discussable.Controller;

	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		viewModel.isActive = ko.observable<boolean>();
		viewModel.general = ko.observable( new ContentViewModel.General );
		viewModel.context = ko.observable( new ContentViewModel.Context );
		this.viewModel = viewModel;
		
		this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content)
			.setViewModelChangedHandler( general => this.viewModel.general(general) )
			.setModelObservable(model.general);

		this.context = new ContentController.Context(model.context(), viewModel.context(), communicator.content);
		
		this.discussable = new Discussable.Controller(model, viewModel, communicator);
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.discussable.setViewModelContext(cxt);
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.context.dispose();
		this.discussable.dispose();
	}
}