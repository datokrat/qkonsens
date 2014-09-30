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
		if(this.entryKeys.indexOf(m) == -1) {
			var v = this.viewModelFactory.create();
			var c = this.controllerFactory.create(m, v);
			
			this.entryKeys.push(m);
			this.entryValues.push({ model: m, viewModel: v, controller: c });
			this.viewModelInsertionHandler(v);
		}
		else
			throw new DuplicateInsertionException();
	}
	
	public removed( m: Model ) {
		var index = this.entryKeys.indexOf(m);
		var mvc = this.entryValues[index];
		
		if(mvc) {
			this.viewModelRemovalHandler(mvc.viewModel);
			
			this.entryKeys.splice(index, 1);
			this.entryValues.splice(index, 1);
			mvc.controller.dispose();
		}
	}
	
	private viewModelFactory: Factory<ViewModel>;
	private controllerFactory: ControllerFactory<Model, ViewModel, Controller>;
	
	private viewModelInsertionHandler: (v: ViewModel) => void;
	private viewModelRemovalHandler: (v: ViewModel) => void;
	
	private entryKeys: Model[] = [];
	private entryValues: { model: Model; viewModel: ViewModel; controller: Controller }[] = [];
	private modelResolverMap: any = {};
}

export interface Factory<T> {
	create(): T;
}

export interface ControllerFactory<Model, ViewModel, Controller> {
	create(m: Model, v: ViewModel): Controller;
}

export class DuplicateInsertionException {
	public toString(): string {
		return "DuplicateInsertionException";
	}
}