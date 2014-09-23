import Content = require('contentviewmodel')
import Observable = require('observable')

export class ViewModel {
	public general: Observable.Observable<Content.General>;
	public context: Observable.Observable<Content.Context>;
	
	public isActive: () => boolean;
}