import Obs = require('../observable')
import Events = require('../event')

export class ObservingChildArraySynchronizer<Model, ViewModel, Controller extends { dispose: () => void }> {
	constructor() {
		this.innerSync = new ChildArraySynchronizer<Model, ViewModel, Controller>();
	}
	
	public setViewModelFactory(fty: Factory<ViewModel>) {
		this.innerSync.setViewModelFactory(fty);
	}
	
	public setControllerFactory(fty: ControllerFactory<Model, ViewModel, Controller>) {
		this.innerSync.setControllerFactory(fty);
	}
	
	public setModelObservable(model: Obs.ObservableArrayEx<Model>) {
		this.disposeModel();
		
		this.modelSubscriptions = [
			model.pushed.subscribe( m => this.innerSync.inserted(m) ),
			model.removed.subscribe( m => this.innerSync.removed(m) ),
			model.changed.subscribe( old => this.innerSync.setInitialState(model.get()) ),
		];
		model.changed.raise();
		return this;
	}
	
	public setViewModelInsertionHandler(handler: (vm: ViewModel) => void) {
		this.innerSync.setViewModelInsertionHandler(handler);
		return this;
	}
	
	public setViewModelRemovalHandler(handler: (vm: ViewModel) => void) {
		this.innerSync.setViewModelRemovalHandler(handler);
		return this;
	}
	
	private disposeModel() {
		this.modelSubscriptions.forEach(s => s.undo());
		this.modelSubscriptions = [];
	}
	
	public dispose() {
		this.disposeModel();
		this.innerSync.dispose();
	}
	
	public modelSubscriptions: Events.Subscription[] = [];
	public innerSync: ChildArraySynchronizer<Model, ViewModel, Controller>;
}

export class ChildArraySynchronizer<Model, ViewModel, Controller extends { dispose: () => void }> {
	public setViewModelFactory(fty: Factory<ViewModel>) {
		this.viewModelFactory = fty;
		return this;
	}
	
	public setControllerFactory(fty: ControllerFactory<Model, ViewModel, Controller>) {
		this.controllerFactory = fty;
		return this;
	}
	
	public setViewModelInsertionHandler( handler: (v: ViewModel) => void ) {
		this.viewModelInsertionHandler = handler || (v => {});
		return this;
	}
	
	public setViewModelRemovalHandler( handler: (v: ViewModel) => void ) {
		this.viewModelRemovalHandler = handler || (v => {});
		return this;
	}
	
	public setInitialState( models: Model[] ) {
		this.clear();
		models.forEach(this.inserted.bind(this));
	}
	
	public inserted( m: Model ) {
		console.log(m);
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
	
	public clear() {
		while(this.entryKeys.length > 0) {
			var key = this.entryKeys[this.entryKeys.length-1];
			this.removed(key);
		}
	}
	
	public dispose() {
		this.clear();
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