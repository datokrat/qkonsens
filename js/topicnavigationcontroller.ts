import Evt = require('event');
import Obs = require('observable');
import Model = require('topicnavigationmodel');
import ViewModel = require('topicnavigationviewmodel');
import Topic = require('topic');
import TSync = require('synchronizers/tsynchronizers');

export class ModelCommunicatorController {
	constructor(model: Model.Model, communicator: Topic.Communicator) {
		this.subscriptions = [
			communicator.childrenReceived.subscribe(args => {
				model.children.set(args.children);
			}),
			Evt.Subscription.fromDisposable(model.selectedTopic.subscribe(topic => {
				communicator.queryChildren(model.selectedTopic().id);
			}))
		];
	}
	
	public dispose() {
		this.subscriptions.forEach(s => s.undo());
	}
	
	private subscriptions: Evt.Subscription[] = [];
}

export class ModelViewModelController {
	constructor(model: Model.Model, viewModel: ViewModel.ViewModel) {
		this.viewModelHistory = ko.observableArray<Topic.ViewModel>();
		viewModel.breadcrumb = ko.computed<Topic.ViewModel[]>(() => this.viewModelHistory().slice(0,-1));
		viewModel.selected = ko.computed<Topic.ViewModel>(() => this.viewModelHistory().get(-1));
		this.breadcrumbSync = new TSync.TopicSync()
			.setModelObservable(model.history)
			.setViewModelObservable(this.viewModelHistory);
		
		this.breadcrumbSync.itemCreated.subscribe(args => {
			args.viewModel.click.subscribe(() => {
				model.selectTopicFromHistory(args.model);
			});
		});
		
		viewModel.children = ko.observableArray<Topic.ViewModel>();
		this.childrenSync = new TSync.TopicSync()
			.setModelObservable(model.children)
			.setViewModelObservable(viewModel.children);
		
		this.childrenSync.itemCreated.subscribe(args => {
			args.viewModel.click.subscribe(() => {
				model.selectChild(args.model);
			});
		});
	}
	
	public dispose() {
		this.breadcrumbSync.dispose();
		this.childrenSync.dispose();
	}
	
	private breadcrumbSync: TSync.TopicSync;
	private childrenSync: TSync.TopicSync;
	private viewModelHistory: Obs.ObservableArray<Topic.ViewModel>;
}

export class Controller {
	constructor(model: Model.Model, viewModel: ViewModel.ViewModel, communicator: Topic.Communicator) {
		this.modelViewModelController = new ModelViewModelController(model, viewModel);
		this.modelCommunicatorController = new ModelCommunicatorController(model, communicator);
	}
	
	public dispose() {
		this.modelViewModelController.dispose();
		this.modelCommunicatorController.dispose();
	}
	
	private modelViewModelController: ModelViewModelController;
	private modelCommunicatorController: ModelCommunicatorController;
}