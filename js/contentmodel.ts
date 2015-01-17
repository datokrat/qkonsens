import Observable = require('observable');

export class Context {
	public id: number;
	public text: Observable.Observable<string> = ko.observable<string>();
	
	public set(context: Context) {
		this.id = context.id;
		this.text(context.text());
	}
}

export class General {
	public postId: number;
	public title: Observable.Observable<string> = ko.observable<string>();
	public text: Observable.Observable<string> = ko.observable<string>();
	
	public set( content: General ) {
		this.title( content.title() );
		this.text( content.text() );
	}
}