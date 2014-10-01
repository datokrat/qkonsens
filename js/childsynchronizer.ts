import Obs = require('observable')

export class ChildSynchronizer<Model, ViewModel, Controller extends { dispose(): void }> {
	public setViewModelFactory(fty: Factory<ViewModel>) {
		this.viewModelFactory = fty;
		return this;
	}
	
	public setControllerFactory(fty: ControllerFactory<Model, ViewModel, Controller>) {
		this.controllerFactory = fty;
		return this;
	}
	
	public setViewModelChangedHandler( handler: (v: ViewModel) => void ) {
		this.viewModelChangedHandler = handler;
		return this;
	}
	
	public setModelObservable(m: Obs.Observable<Model>) {
		this.model = m;
		this.model.subscribe(this.modelChanged.bind(this));
		this.modelChanged();
		return this;
	}
	
	private modelChanged() {
		if(this.controller) this.controller.dispose();
		this.viewModel = this.viewModelFactory.create();
		this.viewModelChangedHandler(this.viewModel);
		this.controller = this.controllerFactory.create(this.model(), this.viewModel);
	}
	
	public dispose() {
		if(this.controller) this.controller.dispose();
	}
	
	private model: Obs.Observable<Model>;
	private viewModel: ViewModel;
	private controller: Controller;
	
	private viewModelFactory: Factory<ViewModel>;
	private controllerFactory: ControllerFactory<Model, ViewModel, Controller>;
	private viewModelChangedHandler: (v: ViewModel) => void;
}

export interface Factory<T> {
	create(): T;
}

export interface ControllerFactory<Model, ViewModel, Controller> {
	create(model: Model, viewModel: ViewModel): Controller;
}