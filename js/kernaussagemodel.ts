import Obs = require('observable')
import Content = require('contentmodel')
import Comment = require('comment')
import Rating = require('rating')
import Discussion = require('discussion')

export class Model {
	public id: Obs.Observable<number> = ko.observable<number>();
	public general: Obs.Observable<Content.General> = ko.observable<Content.General>( new Content.General );
	public context: Obs.Observable<Content.Context> = ko.observable<Content.Context>( new Content.Context );
	public rating: Obs.Observable<Rating.Model> = ko.observable<Rating.Model>( new Rating.Model );
	public discussion: Obs.Observable<Discussion.Model> = ko.observable<Discussion.Model>( new Discussion.Model );
}