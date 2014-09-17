import evt = require('event')

import kernaussageModel = require('kernaussagemodel')
import Content = require('contentmodel')

import EventFactory = require('factories/event')

export class Model {
	public id: number;
	public content = ko.observable<Content.WithContext>( new Content.WithContext() );
	
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