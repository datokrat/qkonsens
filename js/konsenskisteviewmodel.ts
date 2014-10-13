import observable = require('observable')

import Content = require('contentviewmodel')
import Kernaussage = require('kernaussageviewmodel')
import Rating = require('rating')
import Comment = require('comment')
import Discussion = require('discussion')

export class ViewModel {
	public general: observable.Observable<Content.General>;
	public context: observable.Observable<Content.Context>;
	public rating: observable.Observable<Rating.ViewModel>;
	public discussion: observable.Observable<Discussion.ViewModel>;
	
	public childKas: observable.ObservableArray<Kernaussage.ViewModel>;
}