import Observable = require('observable');

class Model {
	public text: Observable.Observable<string> = ko.observable<string>();
}

export = Model;