import Obs = require('../observable')
import Events = require('../event')

export class PureModelArraySynchronizer<Model, Controller extends { dispose: () => void }> {
	constructor() {
	}
	
	public setControllerFactory(fty: PureModelControllerFactory<Model, Controller>) {
		return this;
	}
	
	public setModelObservable(models: Obs.ObservableArrayEx<Model>) {
		this.onModelsChanged(models.get());
		
		this.disposeModelObservable();
		this.disposeControllers();
		
		this.modelSubscriptions = [
			models.pushed.subscribe(model => {
				this.models.push(model);
				this.controllers.push(this.controllerFactory.create(model));
			}),
			models.removed.subscribe(model => {
				var index = this.models.indexOf(model);
				this.models.splice(index, 1);
				this.controllers.splice(index, 1).forEach(c => c.dispose());
			}),
			models.changed.subscribe(this.onModelsChanged)
		];
		return this;
	}
	
	private onModelsChanged = models => {
		this.models = models;
		this.disposeControllers();
		this.controllers = this.models.map(m => this.controllerFactory.create(m));
	}
	
	private disposeModelObservable() {
		this.modelSubscriptions.forEach(s => s.dispose());
		this.modelSubscriptions = [];
		this.models = [];
	}
	
	private disposeControllers() {
		this.controllers.forEach(c => c.dispose());
		this.controllers = [];
	}
	
	private modelSubscriptions: Events.Subscription[] = [];
	private controllerFactory: PureModelControllerFactory<Model, Controller>;
	private models: Model[] = [];
	private controllers: Controller[] = [];
}

export class ObservingChildArraySynchronizer<Model, ViewModel, Controller extends { dispose: () => void }> {
	constructor() {
		this.innerSync = new ChildArraySynchronizer<Model, ViewModel, Controller>();
		this.itemCreated = this.innerSync.itemCreated;
	}
	
	public setViewModelFactory(fty: Factory<ViewModel>) {
		this.innerSync.setViewModelFactory(fty);
		return this;
	}
	
	public setControllerFactory(fty: ControllerFactory<Model, ViewModel, Controller>) {
		this.innerSync.setControllerFactory(fty);
		return this;
	}
	
	public setModelObservable(models: Obs.ObservableArrayEx<Model>) {
		this.models = models;
		this.disposeModelSubscriptions();
		
		this.modelSubscriptions = [
			models.pushed.subscribe( m => this.innerSync.inserted(m) ),
			models.removed.subscribe( m => this.innerSync.removed(m) ),
			models.changed.subscribe( this.initState.bind(this) ),
		];
		this.initState();
		return this;
	}
	
	public setViewModelObservable(viewModels: Obs.ObservableArray<ViewModel>) {
		this.viewModels = viewModels;
		this.innerSync.setViewModelInsertionHandler(vm => viewModels.push(vm));
		this.innerSync.setViewModelRemovalHandler(vm => viewModels.remove(vm));
		this.initState();
		return this;
	}
	
	public initState() {
		if(this.models && this.viewModels)
			this.innerSync.setInitialState(this.models.get());
	}
	
	private disposeModelSubscriptions() {
		this.modelSubscriptions.forEach(s => s.dispose());
		this.modelSubscriptions = [];
	}
	
	public forEachController(cb: (ctr: Controller) => void) {
		this.innerSync.forEachController(cb);
	}
	
	public dispose() {
		this.disposeModelSubscriptions();
		this.innerSync.dispose();
	}
	
	public itemCreated: Events.EventImpl<ItemCreatedArgs<Model, ViewModel, Controller>>;
	
	public models: Obs.ObservableArrayEx<Model>;
	public viewModels: Obs.ObservableArray<ViewModel>;
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
		if(this.entryKeys.indexOf(m) == -1) {
			var v = this.viewModelFactory.create();
			var c = this.controllerFactory.create(m, v);
			
			this.entryKeys.push(m);
			this.entryValues.push({ model: m, viewModel: v, controller: c });
			this.viewModelInsertionHandler(v);
			this.itemCreated.raise({ model: m, viewModel: v, controller: c });
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
	
	public forEachController(cb: (ctr: Controller) => void) {
		this.entryValues.forEach(value => cb(value.controller));
	}
	
	public itemCreated = new Events.EventImpl<ItemCreatedArgs<Model, ViewModel, Controller>>();
	
	private viewModelFactory: Factory<ViewModel>;
	private controllerFactory: ControllerFactory<Model, ViewModel, Controller>;
	
	private viewModelInsertionHandler: (v: ViewModel) => void;
	private viewModelRemovalHandler: (v: ViewModel) => void;
	
	private entryKeys: Model[] = [];
	private entryValues: { model: Model; viewModel: ViewModel; controller: Controller }[] = [];
	private modelResolverMap: any = {};
}

export interface ItemCreatedArgs<Model, ViewModel, Controller> {
	model: Model;
	viewModel: ViewModel;
	controller: Controller;
}

export interface Factory<T> {
	create(): T;
}

export interface ControllerFactory<Model, ViewModel, Controller> {
	create(m: Model, v: ViewModel): Controller;
}

export interface PureModelControllerFactory<Model, Controller> {
	create(m: Model): Controller;
}

export class DuplicateInsertionException {
	public toString(): string {
		return "DuplicateInsertionException";
	}
}