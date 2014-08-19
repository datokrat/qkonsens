import evt = require('event')

import kernaussageModel = require('kernaussagemodel')

export class Model {
	public title = ko.observable<string>();
	
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
	
	public childKaInserted: evt.Event<ChildKaEventArgs> = new evt.EventImpl<ChildKaEventArgs>();
	public childKaRemoved: evt.Event<ChildKaEventArgs> = new evt.EventImpl<ChildKaEventArgs>();
	
	private kaArray = ko.observableArray<kernaussageModel.Model>();
}

export class ChildKaEventArgs {
	public childKa: kernaussageModel.Model;
}