import Evt = require('event');
import Obs = require('observable');
import MainController = require('controller');
import KokiLogic = require('kokilogic');
import Model = require('topicnavigationmodel');
import ViewModel = require('topicnavigationviewmodel');
import Topic = require('topic');
import TSync = require('synchronizers/tsynchronizers');
import KonsenskisteModel = require('konsenskistemodel');
import Commands = require('command');

export class Controller {
	constructor(model: Model.Model, viewModel: ViewModel.ViewModel, args: ControllerArgs) {
		this.modelViewModelController = new ModelViewModelController(model, viewModel, args.commandProcessor);
		this.modelCommunicatorController = new ModelCommunicatorController(model, args.communicator);
	}
	
	public dispose() {
		this.modelViewModelController.dispose();
		this.modelCommunicatorController.dispose();
	}
	
	private modelViewModelController: ModelViewModelController;
	private modelCommunicatorController: ModelCommunicatorController;
}

export interface ControllerArgs {
	communicator: Topic.Communicator;
	commandProcessor: Commands.CommandProcessor;
}

export class ModelCommunicatorController {
	constructor(private model: Model.Model, private communicator: Topic.Communicator) {
		this.subscriptions = [
			communicator.childrenReceived.subscribe(args => {
				if(Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
					model.children.items.set(args.children);
			}),
			communicator.containedKokisReceived.subscribe(args => {
				if(Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
					model.kokis.items.set(args.kokis);
			}),
			model.selectedTopic.subscribe(topic => this.onSelectedTopicChanged(topic)),
		];
		this.onSelectedTopicChanged(model.selectedTopic());
	}
	
	public dispose() {
		this.subscriptions.forEach(s => s.dispose());
	}
	
	private onSelectedTopicChanged(topic: Topic.Model) {
		if(topic) {
			this.communicator.queryChildren(this.model.selectedTopic().id);
			this.communicator.queryContainedKokis(this.model.selectedTopic().id);
		}
	}
	
	private subscriptions: Evt.Subscription[] = [];
}

export class ModelViewModelController {
	constructor(private model: Model.Model, private viewModel: ViewModel.ViewModel, commandProcessor?: Commands.CommandProcessor) {
		this.childTopicCommandControl.commandProcessor.chain.append(cmd => this.handleChildTopicCommand(cmd));
		this.breadcrumbTopicCommandControl.commandProcessor.chain.append(cmd => this.handleBreadcrumbTopicCommand(cmd));
		this.kokiCommandControl.commandProcessor.chain.append(cmd => this.handleKokiCommand(cmd));
		this.kokiCommandControl.commandProcessor.parent = commandProcessor;
		
		this.viewModelHistory = ko.observableArray<Topic.ViewModel>();
		viewModel.breadcrumb = ko.computed<Topic.ViewModel[]>(() => this.viewModelHistory().slice(0,-1));
		viewModel.selected = ko.computed<Topic.ViewModel>(() => this.viewModelHistory().get(-1));
		
		this.breadcrumbSync = new TSync.TopicViewModelSync({ commandControl: this.breadcrumbTopicCommandControl });
		this.breadcrumbSync
			.setModelObservable(model.history)
			.setViewModelObservable(this.viewModelHistory);
		
		viewModel.children = new ViewModel.Children();
		viewModel.children.items = ko.observableArray<Topic.ViewModel>();
		this.childrenSync = new TSync.TopicViewModelSync({ commandControl: this.childTopicCommandControl });
		this.childrenSync
			.setModelObservable(model.children.items)
			.setViewModelObservable(viewModel.children.items);
		
		viewModel.kokis = new ViewModel.Kokis();
		viewModel.kokis.items = ko.observableArray<Topic.ViewModel>();
		this.kokiSync = new TSync.KokiItemViewModelSync({ commandControl: this.kokiCommandControl });
		this.kokiSync
			.setViewModelObservable(viewModel.kokis.items)
			.setModelObservable(model.kokis.items);
		
		viewModel.clickCreateNewKoki = () => {
			commandProcessor.processCommand(new MainController.OpenNewKokiWindowCommand(this.model.selectedTopic()));
		};
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
	
	private handleKokiCommand(cmd: Commands.Command) {
		return false;
	}
	
	public dispose() {
		this.breadcrumbSync.dispose();
		this.childrenSync.dispose();
		this.kokiSync.dispose();
	}
	
	public childTopicCommandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor() };
	public breadcrumbTopicCommandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor() };
	public kokiCommandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor() };
	
	private breadcrumbSync: TSync.TopicViewModelSync;
	private childrenSync: TSync.TopicViewModelSync;
	private kokiSync: TSync.KokiItemViewModelSync;
	private viewModelHistory: Obs.ObservableArray<Topic.ViewModel>;
}

export class KokiItemViewModelController {
	constructor(model: KonsenskisteModel.Model, private viewModel: ViewModel.KokiItem, commandControl?: Commands.CommandControl) {
		this.viewModel.caption = ko.computed(() => model.general().title() ? model.general().title() : model.general().text());
		this.viewModel.click = () => {
			commandControl && commandControl.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(model));
		};
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
	}
}