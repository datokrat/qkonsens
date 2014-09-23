import Observable = require('observable')
import Content = require('contentmodel')

export class Model {
	public id: number;
	public general: Observable.Observable<Content.General> = ko.observable<Content.General>( new Content.General );
	public context: Observable.Observable<Content.Context> = ko.observable<Content.Context>( new Content.Context );
}