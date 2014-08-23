import Observable = require('observable');

class ViewModel {
	public text: Observable.Observable<string>;
	public isVisible: Observable.Observable<boolean>;
}

export = ViewModel;