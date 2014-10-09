import Obs = require('observable')
import Content = require('contentmodel')
import Comment = require('comment')
import Discussable = require('discussable')

export class Model implements Discussable.Model {
	public id: number;
	public general: Obs.Observable<Content.General> = ko.observable<Content.General>( new Content.General );
	public context: Obs.Observable<Content.Context> = ko.observable<Content.Context>( new Content.Context );
	public comments: Obs.ObservableArrayEx<Comment.Model> = new Obs.ObservableArrayExtender(ko.observableArray<Comment.Model>());
	public commentsLoaded: Obs.Observable<boolean> = ko.observable<boolean>(false);
	public commentsLoading: Obs.Observable<boolean> = ko.observable<boolean>(false);
}