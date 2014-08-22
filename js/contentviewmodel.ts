import observable = require('observable')

export class ViewModel {
	public title: observable.Observable<string>;
	public text: observable.Observable<string>;
}