import Observable = require('observable');

export class Context {
	public postId: number;
	public text: Observable.Observable<string> = ko.observable<string>();
	
	public set(context: Context) {
		this.postId = context.postId;
		this.text(context.text());
	}
}

export class General {
	public postId: number;
	public title: Observable.Observable<string> = ko.observable<string>();
	public text: Observable.Observable<string> = ko.observable<string>();
	
	public set( content: General ) {
		this.postId = content.postId;
		this.title( content.title() );
		this.text( content.text() );
	}
}