import observable = require('observable')

import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')
import com = require('contentcommunicator')

import ContentController = require('contentcontroller')
import ContentViewModel = require('contentviewmodel')

export class Controller {
	private viewModel: vm.ViewModel;
	private generalContent: ContentController.General;
	private context: ContentController.Context;

	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		viewModel.isActive = ko.observable<boolean>();
		viewModel.general = ko.observable( new ContentViewModel.General );
		viewModel.context = ko.observable( new ContentViewModel.Context );
		this.viewModel = viewModel;
		
		this.generalContent = new ContentController.General(model.general(), viewModel.general(), communicator);
		this.context = new ContentController.Context(model.context(), viewModel.context());
	}
	
	public dispose() {
		this.generalContent.dispose();
		this.context.dispose();
	}
}