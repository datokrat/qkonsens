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
			model.selectedTopic.subscribe(topic => {
				communicator.queryChildren(model.selectedTopic().id);
			})
		];
	}
	
	public dispose() {
		this.subscriptions.forEach(s => s.dispose());
	}
	
	private subscriptions: Evt.Subscription[] = [];
}

export class ModelViewModelController {
	constructor(model: Model.Model, viewModel: ViewModel.ViewModel) {
		this.viewModelHistory = ko.observableArray<Topic.ViewModel>();
		viewModel.breadcrumb = ko.computed<Topic.ViewModel[]>(() => this.viewModelHistory().slice(0,-1));
		viewModel.selected = ko.computed<Topic.ViewModel>(() => this.viewModelHistory().get(-1));
		this.breadcrumbSync = new TSync.TopicViewModelSync();
		this.breadcrumbSync
			.setModelObservable(model.history)
			.setViewModelObservable(this.viewModelHistory);
		
		this.breadcrumbSync.itemCreated.subscribe(args => {
			args.viewModel.click.subscribe(() => {
				model.selectTopicFromHistory(args.model);
			});
		});
		
		viewModel.children = ko.observableArray<Topic.ViewModel>();
		this.childrenSync = new TSync.TopicViewModelSync();
		this.childrenSync
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
	
	private breadcrumbSync: TSync.TopicViewModelSync;
	private childrenSync: TSync.TopicViewModelSync;
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