import Obs = require('observable');
import Evt = require('event');
import TopicNavigationModel = require('topicnavigationmodel');
import TopicNavigationViewModel = require('topicnavigationviewmodel');
import TopicNavigationController = require('topicnavigationcontroller');
import Topic = require('topic');
import KonsenskisteModel = require('konsenskistemodel');
import Commands = require('command');

export class Controller {
	constructor(model: Model, viewModel: ViewModel, communicator: Topic.Communicator) {
		this.modelViewModelController = new ModelViewModelController(model, viewModel);
		this.modelCommunicatorController = new ModelCommunicatorController(model, communicator);
	}
	
	public dispose() {
		this.modelViewModelController.dispose();
	}
	
	private modelViewModelController: ModelViewModelController;
	private modelCommunicatorController: ModelCommunicatorController;
}

export class ModelViewModelController {
	constructor(model: Model, viewModel: ViewModel, parent?: Commands.CommandControl) {
		this.model = model;
		this.viewModel = viewModel;
		
		this.viewModel.caption = ko.computed<string>(() => {
			return this.model.title() || (this.model.text() && this.model.text().substr(0,255));
		});
		this.viewModel.description = ko.computed<string>(() => {
			return this.model.title() && this.model.text();
		});
		//this.viewModel.click = new Evt.EventImpl<void>();
		this.viewModel.click = () => {
			parent && parent.commandProcessor.processCommand(new TopicSelectedCommand(model, viewModel));
		};
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
		this.viewModel.description.dispose();
	}
	
	private model: Model;
	private viewModel: ViewModel;
}

export class TopicSelectedCommand extends Commands.Command {
	constructor(public model?: Model, public viewModel?: ViewModel) {
		super();
	}
}

export class ModelCommunicatorController {
	constructor(model: Model, communicator: Communicator) {
	}
	
	dispose() {
		this.communicatorSubscriptions.forEach(s => s.dispose());
		this.communicatorSubscriptions = [];
		
		this.modelSubscriptions.forEach(s => s.dispose());
		this.modelSubscriptions = [];
	}
	
	private communicatorSubscriptions: Evt.Subscription[] = [];
	private modelSubscriptions: Evt.Subscription[] = [];
}

export class Model {
	public id: TopicIdentifier = { root: false, id: null };
	
	public title = ko.observable<string>();
	public text = ko.observable<string>();
	
	public set(other: Model): Model {
		this.title(other.title());
		this.text(other.text());
		this.id = other.id;
		return this;
	}
}

export class ViewModel {
	public caption: Obs.Observable<string>;
	public description: Obs.Observable<string>;
	public click: () => void;
}

export interface Communicator {
	queryChildren(id: TopicIdentifier, out?: TopicNavigationModel.Children): void;
	queryContainedKokis(id: TopicIdentifier, out?: TopicNavigationModel.Kokis): void;
	childrenReceived: Evt.Event<ChildrenReceivedArgs>;
	containedKokisReceived: Evt.Event<ContainedKokisReceivedArgs>;
}

export interface TopicIdentifier {
	id: number;
	root?: boolean;
}

export class IdentifierHelper {
	public static equals(id1: TopicIdentifier, id2: TopicIdentifier) {
		return (id1.root && id2.root) || (!id1.root && !id1.root && id1.id == id2.id);
	}
}

export interface ChildrenReceivedArgs {
	id: TopicIdentifier;
	children: Model[];
}

export interface ContainedKokisReceivedArgs {
	id: TopicIdentifier;
	kokis: KonsenskisteModel.Model[];
}