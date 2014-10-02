import observable = require('observable')

import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')
import com = require('contentcommunicator')

import KSync = require('synchronizers/ksynchronizers')

import ContentController = require('contentcontroller')
import ContentViewModel = require('contentviewmodel')

export class Controller {
	private viewModel: vm.ViewModel;
	private generalContentSynchronizer: KSync.GeneralContentSynchronizer;
	private context: ContentController.Context;

	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		viewModel.isActive = ko.observable<boolean>();
		viewModel.general = ko.observable( new ContentViewModel.General );
		viewModel.context = ko.observable( new ContentViewModel.Context );
		this.viewModel = viewModel;
		
		this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(communicator)
			.setViewModelChangedHandler( general => this.viewModel.general(general) )
			.setModelObservable(model.general);

		this.context = new ContentController.Context(model.context(), viewModel.context(), communicator);
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.context.dispose();
	}
}