import Obs = require('observable')

import Content = require('contentviewmodel')
import Kernaussage = require('kernaussageviewmodel')
import Rating = require('rating')
import Comment = require('comment')
import Discussion = require('discussion')

import KElement = require('kelement');

export class ViewModel extends KElement.ViewModel {
	public error: Obs.Observable<string>;
	public loading: Obs.Observable<boolean>;
	
	public childKas: Obs.ObservableArray<Kernaussage.ViewModel>;
	public newKaFormVisible: Obs.Observable<boolean>;
	public newKaClick: () => void;
	public newKaSubmit: () => void;
	public newKaTitle: Obs.Observable<string>;
	public newKaText: Obs.Observable<string>;
	public newKaContext: Obs.Observable<string>;
}