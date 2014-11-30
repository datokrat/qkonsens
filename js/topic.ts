import Obs = require('observable');
import Evt = require('event');
import TopicNavigationModel = require('topicnavigationmodel');
import TopicNavigationViewModel = require('topicnavigationviewmodel');
import TopicNavigationController = require('topicnavigationcontroller');
import Topic = require('topic');

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
	constructor(model: Model, viewModel: ViewModel) {
		this.model = model;
		this.viewModel = viewModel;
		
		this.viewModel.caption = ko.computed<string>(() => {
			return this.model.title() || (this.model.text() && this.model.text().substr(0,255));
		});
		this.viewModel.description = ko.computed<string>(() => {
			return this.model.title() && this.model.text();
		});
		this.viewModel.click = new Evt.EventImpl<void>();
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
		this.viewModel.description.dispose();
	}
	
	private model: Model;
	private viewModel: ViewModel;
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
	public id: TopicIdentifier;
	
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
	public click: Evt.Event<void>;
}

export interface Communicator {
	queryChildren(id: TopicIdentifier): void;
	childrenReceived: Evt.Event<ChildrenReceivedArgs>;
}

export interface TopicIdentifier {
	id: number;
	root?: boolean;
}

export interface ChildrenReceivedArgs {
	id: TopicIdentifier;
	children: Model[];
}