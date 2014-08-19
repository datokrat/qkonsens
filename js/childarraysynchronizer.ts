export class ChildArraySynchronizer<Model, ViewModel, Controller extends { dispose: () => void }> {
	public setViewModelFactory(fty: Factory<ViewModel>) {
		this.viewModelFactory = fty;
	}
	
	public setControllerFactory(fty: ControllerFactory<Model, ViewModel, Controller>) {
		this.controllerFactory = fty;
	}
	
	public setViewModelInsertionHandler( handler: (v: ViewModel) => void ) {
		this.viewModelInsertionHandler = handler || (v => {});
	}
	
	public setViewModelRemovalHandler( handler: (v: ViewModel) => void ) {
		this.viewModelRemovalHandler = handler || (v => {});
	}	
	
	public inserted( m: Model ) {
		if(!this.modelResolverMap[m]) {
			var v = this.viewModelFactory.create();
			var c = this.controllerFactory.create(m, v);
			
			this.modelResolverMap[m] = { model: m, viewModel: v, controller: c };
			this.viewModelInsertionHandler(v);
		}
		else
			throw new DuplicateInsertionException();
	}
	
	public removed( m: Model ) {
		var mvc = this.modelResolverMap[m];
		this.modelResolverMap[m];
		
		if(mvc) {
			this.viewModelRemovalHandler(mvc.viewModel);
			
			delete this.modelResolverMap[m];
			mvc.controller.dispose();
		}
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

export class DuplicateInsertionException {
}