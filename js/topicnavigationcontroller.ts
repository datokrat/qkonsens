import Evt = require('event');
import Obs = require('observable');
import Model = require('topicnavigationmodel');
import ViewModel = require('topicnavigationviewmodel');
import Topic = require('topic');
import TSync = require('synchronizers/tsynchronizers');
import ContentModel = require('contentmodel');
import Commands = require('command');

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

export class ModelCommunicatorController {
	constructor(model: Model.Model, communicator: Topic.Communicator) {
		this.subscriptions = [
			communicator.childrenReceived.subscribe(args => {
				if(Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
					model.children.set(args.children);
			}),
			communicator.containedKokisReceived.subscribe(args => {
				if(Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
					model.kokis.set(args.kokis.map(k => k.general()));
			}),
			model.selectedTopic.subscribe(topic => {
				communicator.queryChildren(model.selectedTopic().id);
				communicator.queryContainedKokis(model.selectedTopic().id);
			}),
		];
	}
	
	public dispose() {
		this.subscriptions.forEach(s => s.dispose());
	}
	
	private subscriptions: Evt.Subscription[] = [];
}

export class ModelViewModelController {
	constructor(private model: Model.Model, private viewModel: ViewModel.ViewModel) {
		this.childTopicCommandControl.commandProcessor.chain.append(cmd => this.handleChildTopicCommand(cmd));
		this.breadcrumbTopicCommandControl.commandProcessor.chain.append(cmd => this.handleBreadcrumbTopicCommand(cmd));
		
		this.viewModelHistory = ko.observableArray<Topic.ViewModel>();
		viewModel.breadcrumb = ko.computed<Topic.ViewModel[]>(() => this.viewModelHistory().slice(0,-1));
		viewModel.selected = ko.computed<Topic.ViewModel>(() => this.viewModelHistory().get(-1));
		this.breadcrumbSync = new TSync.TopicViewModelSync({ commandControl: this.breadcrumbTopicCommandControl });
		this.breadcrumbSync
			.setModelObservable(model.history)
			.setViewModelObservable(this.viewModelHistory);
		
		viewModel.children = ko.observableArray<Topic.ViewModel>();
		this.childrenSync = new TSync.TopicViewModelSync({ commandControl: this.childTopicCommandControl });
		this.childrenSync
			.setModelObservable(model.children)
			.setViewModelObservable(viewModel.children);
		
		viewModel.kokis = ko.observableArray<Topic.ViewModel>();
		this.kokiSync = new TSync.KokiItemViewModelSync();
		this.kokiSync
			.setViewModelObservable(viewModel.kokis)
			.setModelObservable(model.kokis);
	}
	
	private handleChildTopicCommand(cmd: Commands.Command) {
		if(cmd instanceof Topic.TopicSelectedCommand) {
			this.model.selectChild((<Topic.TopicSelectedCommand>cmd).model);
			return true;
		}
		return false;
	}
	
	private handleBreadcrumbTopicCommand(cmd: Commands.Command) {
		if(cmd instanceof Topic.TopicSelectedCommand) {
			this.model.selectTopicFromHistory((<Topic.TopicSelectedCommand>cmd).model);
			return true;
		}
		return false;
	}
	
	public dispose() {
		this.breadcrumbSync.dispose();
		this.childrenSync.dispose();
		this.kokiSync.dispose();
	}
	
	public childTopicCommandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor() };
	public breadcrumbTopicCommandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor() };
	
	private breadcrumbSync: TSync.TopicViewModelSync;
	private childrenSync: TSync.TopicViewModelSync;
	private kokiSync: TSync.KokiItemViewModelSync;
	private viewModelHistory: Obs.ObservableArray<Topic.ViewModel>;
}

export class KokiItemViewModelController {
	constructor(model: ContentModel.General, private viewModel: ViewModel.KokiItem) {
		this.viewModel.caption = ko.computed(() => model.title() ? model.title() : model.text());
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
	}
}