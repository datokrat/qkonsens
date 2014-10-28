import Obs = require('observable')

import Content = require('contentviewmodel')
import Kernaussage = require('kernaussageviewmodel')
import Rating = require('rating')
import Comment = require('comment')
import Discussion = require('discussion')

export class ViewModel {
	public error: Obs.Observable<string>;
	public loading: Obs.Observable<boolean>;
	
	public general: Obs.Observable<Content.General>;
	public context: Obs.Observable<Content.Context>;
	public rating: Obs.Observable<Rating.ViewModel>;
	public discussion: Obs.Observable<Discussion.ViewModel>;
	
	public childKas: Obs.ObservableArray<Kernaussage.ViewModel>;
	public newKaFormVisible: Obs.Observable<boolean>;
	public newKaClick: () => void;
	public newKaSubmit: () => void;
	public newKaTitle: Obs.Observable<string>;
	public newKaText: Obs.Observable<string>;
}