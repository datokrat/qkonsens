export class Topic {
	public id: number;
	
	public parent = ko.observable<Topic>();
	//public children = ko.observableArray<Topic>();
	//public kks = ko.observableArray<Konsenskiste>();
	
	public title = ko.observable<string>();
	public text = ko.observable<string>();
	
	constructor(id?: number, parent?: Topic) {
		this.id = id;
		this.parent(parent);
	}
}