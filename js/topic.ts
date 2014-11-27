import Obs = require('observable');
import Evt = require('event');
import TopicNavigationModel = require('topicnavigationmodel');
import TopicNavigationViewModel = require('topicnavigationviewmodel');
import TopicNavigationController = require('topicnavigationcontroller');

/*export class ParentController {
	constructor(model: ExtendedModel, viewModel: ParentViewModel, communicator: Communicator) {
		this.model = model;
		this.viewModel = viewModel;
		
		this.viewModel.caption = ko.computed<string>(() => this.model.properties().title() || this.getShortenedText());
		this.viewModel.description = ko.computed<string>(() => this.model.properties().title() && this.model.properties().text());

		this.viewModel.click = () => {};
	}
	
	private getShortenedText(): string {
		return this.model.properties().text() && this.model.properties().text().substr(0, 255);
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
		this.viewModel.description.dispose();
		this.subscriptions.forEach(s => s.undo());
	}
	
	private model: ExtendedModel;
	private viewModel: ParentViewModel;
	
	private subscriptions: Evt.Subscription[] = [];
}*/

export class ChildController {
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

/*export class ExtendedModel {
	public properties = ko.observable<Model>(new Model);
	public children: Obs.ObservableArrayEx<Model> = new Obs.ObservableArrayExtender(ko.observableArray<Model>());
	
	public set(other: ExtendedModel): ExtendedModel {
		this.properties().set(other.properties());
		this.children.set(other.children.get().map(child => new Model().set(child)));
		return this;
	}
}*/

export class Model {
	public id: TopicIdentifier;
	
	//public parent = ko.observable<Model>();
	//public children = ko.observableArray<TopicModel>();
	//public kks = ko.observableArray<Konsenskiste>();
	
	public title = ko.observable<string>();
	public text = ko.observable<string>();
	
	public set(other: Model): Model {
		this.title(other.title());
		this.text(other.text());
		this.id = other.id;
		return this;
	}
}


/*export class ParentViewModel {
	public caption: Obs.Observable<string>;
	public description: Obs.Observable<string>;
	//public children: Obs.ObservableArray<ViewModel>;
	
	public click: () => void;
}*/

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