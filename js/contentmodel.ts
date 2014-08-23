export class Model {
	public title = ko.observable<string>();
	public text = ko.observable<string>();
}

export class WithContext extends Model {
	public context = ko.observable<string>();
}