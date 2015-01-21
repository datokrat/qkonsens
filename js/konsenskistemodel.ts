import evt = require('event')

import KernaussageModel = require('kernaussagemodel')

import KElement = require('kelement');

import EventFactory = require('factories/event')
import Obs = require('observable')
import QueryState = require('querystate');

export class Model extends KElement.Model {
	public childKas: Obs.ObservableArrayEx<KernaussageModel.Model> 
		= new Obs.ObservableArrayExtender<KernaussageModel.Model>(ko.observableArray<KernaussageModel.Model>());
	
	public queryState = ko.observable<QueryState.QueryState>(new QueryState.QueryState());
	
	public set(rhs: Model) {
		KElement.Model.prototype.set.apply(this, arguments);
		this.setChildKas(rhs.childKas.get())
		this.queryState().set(rhs.queryState());
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