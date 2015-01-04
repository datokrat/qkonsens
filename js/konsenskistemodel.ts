import evt = require('event')

import KernaussageModel = require('kernaussagemodel')

import KElement = require('kelement');

import EventFactory = require('factories/event')
import Obs = require('observable')

export class Model extends KElement.Model {
	public childKas: Obs.ObservableArrayEx<KernaussageModel.Model> 
		= new Obs.ObservableArrayExtender<KernaussageModel.Model>(ko.observableArray<KernaussageModel.Model>());
	
	public error: Obs.Observable<string> = ko.observable<string>();
	public loading: Obs.Observable<boolean> = ko.observable<boolean>();
	
	public set(model: Model) {
		console.log('begin set');
		KElement.Model.prototype.set.apply(this, arguments);
		this.setChildKas(model.childKas.get())
		this.loading(model.loading());
		this.error(model.error());
		console.log('end set');
	}
	
	private setChildKas(other: KernaussageModel.Model[]) {
		this.childKas.set(other.map(otherKa => {
			var ka = new KernaussageModel.Model();
			ka.set(otherKa);
			return ka;
		}));
	}
	
	constructor(context: ModelContext = new ModelContext) {
		super();
		this.factoryContext = context;
	}
	
	private factoryContext: ModelContext;
}

export class ChildKaEventArgs {
	public childKa: KernaussageModel.Model;
}

export class ModelContext {
	public eventFactory: EventFactory.Factory = new EventFactory.FactoryImpl();
}