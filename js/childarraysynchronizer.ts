export class ChildArraySynchronizer<Model, ViewModel, Controller> {
	public setViewModelFactory(fty: Factory<ViewModel>) {
		this.viewModelFactory = fty;
	}
	
	public setControllerFactory(fty: ControllerFactory<Model, ViewModel, Controller>) {
		this.controllerFactory = fty;
	}
	
	public setViewModelInsertionHandler( handler: (v: ViewModel) => void ) {
		this.viewModelInsertionHandler = handler;
	}
	
	public setViewModelRemovalHandler( handler: (v: ViewModel) => void ) {
		this.viewModelRemovalHandler = handler;
	}	
	
	public inserted( m: Model ) {
		var v = this.viewModelFactory.create();
		var c = this.controllerFactory.create(m, v);
		
		this.modelResolverMap[m] = { model: m, viewModel: v, controller: c };
		this.viewModelInsertionHandler(v);
	}
	
	public removed( m: Model ) {
		var mvc = this.modelResolverMap[m];
		//TODO: remove mvc
		this.viewModelRemovalHandler(mvc.viewModel);
	}
	
	private viewModelFactory: Factory<ViewModel>;
	private controllerFactory: ControllerFactory<Model, ViewModel, Controller>;
	
	private viewModelInsertionHandler: (v: ViewModel) => void;
	private viewModelRemovalHandler: (v: ViewModel) => void;
	
	private modelResolverMap: any = {};
}

export interface Factory<T> {
	create(): T;
}

export interface ControllerFactory<Model, ViewModel, Controller> {
	create(m: Model, v: ViewModel): Controller;
}