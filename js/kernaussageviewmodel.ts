import Content = require('contentviewmodel')
import Observable = require('observable')

export class ViewModel {
	public content: Observable.Observable<Content.WithContext>;
	public isActive: () => boolean;
}