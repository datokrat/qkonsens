import Evt = require('event');
import Obs = require('observable');
import Model = require('topicnavigationmodel');
import ViewModel = require('topicnavigationviewmodel');
import Topic = require('topic');
import TSync = require('synchronizers/tsynchronizers');
import KonsenskisteModel = require('konsenskistemodel');
import Commands = require('command');

export class Controller {
	constructor(model: Model.Model, viewModel: ViewModel.ViewModel, args: ControllerArgs) {
		this.modelViewModelController = new ModelViewModelController(model, viewModel, args.commandControl);
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
	commandControl?: Commands.CommandControl;
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
					model.kokis.set(args.kokis);
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
	constructor(private model: Model.Model, private viewModel: ViewModel.ViewModel, commandControl?: Commands.CommandControl) {
		this.childTopicCommandControl.commandProcessor.chain.append(cmd => this.handleChildTopicCommand(cmd));
		this.breadcrumbTopicCommandControl.commandProcessor.chain.append(cmd => this.handleBreadcrumbTopicCommand(cmd));
		this.kokiCommandControl.commandProcessor.chain.append(cmd => this.handleKokiCommand(cmd));
		this.kokiCommandControl.commandProcessor.parent = commandControl && commandControl.commandProcessor;
		
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
		this.kokiSync = new TSync.KokiItemViewModelSync({ commandControl: this.kokiCommandControl });
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
			commandControl && commandControl.commandProcessor.processCommand(new SelectKokiCommand(model));
		};
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
	}
}

export class SelectKokiCommand extends Commands.Command {
	constructor(public model: KonsenskisteModel.Model) { super() }
}