import observable = require('observable')

export class ViewModel {
	public title: observable.Observable<string>;
	public text: observable.Observable<string>;
}

export class WithContext extends ViewModel {
	public context: observable.Observable<string>;
}