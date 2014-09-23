import Observable = require('observable')
import Events = require('event')

import Context = require('contextviewmodel')

export class General {
	public title: Observable.Observable<string>;
	public text: Observable.Observable<string>;
}

export class Context {
	public text: Observable.Observable<string>;
	public isVisible: Observable.Observable<boolean>;
	
	public toggleVisibility: Events.Event<Events.Void>;
}