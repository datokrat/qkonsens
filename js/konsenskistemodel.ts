import evt = require('event')

import kernaussageModel = require('kernaussagemodel')
import Content = require('contentmodel')
import Rating = require('rating')
import Comment = require('comment')
import Discussion = require('discussable')

import EventFactory = require('factories/event')
import Obs = require('observable')

export class Model {
	public id: Obs.Observable<number> = ko.observable<number>();
	public general: Obs.Observable<Content.General> = ko.observable<Content.General>( new Content.General );
	public context: Obs.Observable<Content.Context> = ko.observable<Content.Context>( new Content.Context );
	public rating: Obs.Observable<Rating.Model> = ko.observable<Rating.Model>( new Rating.Model );
	public childKas: Obs.ObservableArrayEx<kernaussageModel.Model> 
		= new Obs.ObservableArrayExtender<kernaussageModel.Model>(ko.observableArray<kernaussageModel.Model>());
		
	public discussion: Obs.Observable<Discussion.Model> = ko.observable<Discussion.Model>( new Discussion.Model );
	
	public set(model: Model) {
		this.id(model.id());
		this.general().set(model.general());
		this.context().set(model.context());
	}
	
	constructor(context: ModelContext = new ModelContext) {
		this.factoryContext = context;
	}
	
	private factoryContext: ModelContext;
}

export class ChildKaEventArgs {
	public childKa: kernaussageModel.Model;
}

export class ModelContext {
	public eventFactory: EventFactory.Factory = new EventFactory.FactoryImpl();
}