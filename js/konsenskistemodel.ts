import evt = require('event')

import kernaussageModel = require('kernaussagemodel')
import Content = require('contentmodel')

import EventFactory = require('factories/event')
import Observable = require('observable')

export class Model {
	public id: number;
	public general: Observable.Observable<Content.General> = ko.observable<Content.General>( new Content.General );
	public context: Observable.Observable<Content.Context> = ko.observable<Content.Context>( new Content.Context );
	
	public set(model: Model) {
		this.id = model.id;
		this.general().set(model.general());
		this.context().set(model.context());
	}
	
	public appendKa(ka: kernaussageModel.Model) {
		this.kaArray.push(ka);
		
		this.childKaInserted.raise({ childKa: ka });
	}
	
	public removeKa(ka: kernaussageModel.Model) {
		this.kaArray.remove(ka);
		
		this.childKaRemoved.raise({ childKa: ka });
	}
	
	public getChildKaArray(): kernaussageModel.Model[] {
		return this.kaArray();
	}
	
	constructor(context: ModelContext = new ModelContext) {
		this.childKaInserted = context.eventFactory.create<ChildKaEventArgs>();
		this.childKaRemoved = context.eventFactory.create<ChildKaEventArgs>();
	}
	
	public childKaInserted: evt.Event<ChildKaEventArgs>;
	public childKaRemoved: evt.Event<ChildKaEventArgs>;
	
	private kaArray = ko.observableArray<kernaussageModel.Model>();
}

export class ChildKaEventArgs {
	public childKa: kernaussageModel.Model;
}

export class ModelContext {
	public eventFactory: EventFactory.Factory = new EventFactory.FactoryImpl();
}