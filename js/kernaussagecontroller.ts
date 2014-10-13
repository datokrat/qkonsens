import observable = require('observable')

import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')
import com = require('kernaussagecommunicator')
import ViewModelContext = require('viewmodelcontext')

import KSync = require('synchronizers/ksynchronizers')
import Discussable = require('discussion')

import ContentController = require('contentcontroller')
import ContentViewModel = require('contentviewmodel')

export class Controller {
	private viewModel: vm.ViewModel;
	private generalContentSynchronizer: KSync.GeneralContentSynchronizer;
	private contextSynchronizer: KSync.ContextSynchronizer;
	private discussionSynchronizer: KSync.DiscussionSynchronizer;
	private ratingSynchronizer: KSync.RatingSynchronizer;

	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		this.init(model, viewModel, communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: com.Main) {
		viewModel.isActive = ko.observable<boolean>();
		this.viewModel = viewModel;
		
		viewModel.context = ko.observable( new ContentViewModel.Context );
		this.contextSynchronizer = new KSync.ContextSynchronizer(communicator.content)
			.setViewModelChangedHandler( context => this.viewModel.context(context) )
			.setModelObservable(model.context);
		
		viewModel.general = ko.observable( new ContentViewModel.General );
		this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content)
			.setViewModelChangedHandler( general => this.viewModel.general(general) )
			.setModelObservable(model.general);
		
        viewModel.discussion = ko.observable<Discussable.ViewModel>();
		this.discussionSynchronizer = new KSync.DiscussionSynchronizer(communicator.discussion);
		this.discussionSynchronizer
			.setDiscussableModel(model)
			.setDiscussableViewModel(viewModel)
			.setViewModelObservable(viewModel.discussion)
			.setModelObservable(model.discussion);
		
		this.ratingSynchronizer = new KSync.RatingSynchronizer();
		viewModel.rating = this.ratingSynchronizer.createViewModelObservable();
		this.ratingSynchronizer
			.setViewModelChangedHandler( rating => this.viewModel.rating(rating) )
			.setModelObservable(model.rating);
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.discussionSynchronizer.setViewModelContext(cxt);
	}
	
	public dispose() {
		this.generalContentSynchronizer.dispose();
		this.contextSynchronizer.dispose();
		this.discussionSynchronizer.dispose();
		this.ratingSynchronizer.dispose();
	}
}