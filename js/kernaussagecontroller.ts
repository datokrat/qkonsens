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
	private discussionSynchronizer: KSync.DiscussionSynchronizer;

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
		
        viewModel.discussion = ko.observable<Discussable.ViewModel>();
		this.discussionSynchronizer = new KSync.DiscussionSynchronizer(communicator);
		this.discussionSynchronizer
			.setDiscussableModel(model)
			.setDiscussableViewModel(viewModel)
			.setViewModelObservable(viewModel.discussion)
			.setModelObservable(model.discussion);
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.discussionSynchronizer.setViewModelContext(cxt);
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.context.dispose();
		this.discussionSynchronizer.dispose();
	}
}