import evt = require('event')

import kernaussageModel = require('kernaussagemodel')
import Content = require('contentmodel')
import Rating = require('rating')
import Comment = require('comment')

import EventFactory = require('factories/event')
import Observable = require('observable')

export class Model {
	public id: number;
	public general: Observable.Observable<Content.General> = ko.observable<Content.General>( new Content.General );
	public context: Observable.Observable<Content.Context> = ko.observable<Content.Context>( new Content.Context );
	public rating: Observable.Observable<Rating.Model> = ko.observable<Rating.Model>( new Rating.Model );
	public childKas: Observable.ObservableArrayEx<kernaussageModel.Model>
		= new Observable.ObservableArrayExtender<kernaussageModel.Model>(ko.observableArray<kernaussageModel.Model>());
	public comments: Observable.ObservableArrayEx<Comment.Model> 
		= new Observable.ObservableArrayExtender<Comment.Model>(ko.observableArray<Comment.Model>());
	
	public set(model: Model) {
		this.id = model.id;
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