import Obs = require('observable');

export class ParentController {
	constructor(model: ParentModel, viewModel: ParentViewModel) {
		this.model = model;
		this.viewModel = viewModel;
		
		this.viewModel.caption = ko.computed<string>(() => this.model.properties().title() || this.model.properties().text().substr(0,255));
		this.viewModel.description = ko.computed<string>(() => !this.model.properties().title() && this.model.properties().text());
		this.viewModel.click = () => {};
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
		this.viewModel.description.dispose();
	}
	
	private model: ParentModel;
	private viewModel: ParentViewModel;
}

export class ChildController {
	constructor(model: Model, viewModel: ChildViewModel) {
		this.model = model;
		this.viewModel = viewModel;
		
		this.viewModel.caption = ko.computed<string>(() => {
			return this.model.title() || this.model.text().substr(0,255);
		});
		this.viewModel.click = () => {};
	}
	
	public dispose() {
		this.viewModel.caption.dispose();
	}
	
	private model: Model;
	private viewModel: ChildViewModel;
}

export class ParentModel {
	public properties = ko.observable<Model>();
	public children = ko.observableArray<Model>();
}

export class Model {
	public id: number;
	
	public parent = ko.observable<Model>();
	//public children = ko.observableArray<TopicModel>();
	//public kks = ko.observableArray<Konsenskiste>();
	
	public title = ko.observable<string>();
	public text = ko.observable<string>();
}


export class ParentViewModel {
	public caption: Obs.Observable<string>;
	public description: Obs.Observable<string>;
	public children: Obs.ObservableArray<ChildViewModel>;
	
	public click: () => void;
}

export class ChildViewModel {
	public caption: Obs.Observable<string>;
	public click: () => void;
}