import Observable = require('observable')
import Context = require('contextviewmodel')

export class ViewModel {
	public title: Observable.Observable<string>;
	public text: Observable.Observable<string>;
}

export class WithContext extends ViewModel {
	public context: Observable.Observable<Context>;
}