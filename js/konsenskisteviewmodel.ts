import Obs = require('observable')

import Content = require('contentviewmodel')
import Kernaussage = require('kernaussageviewmodel')
import Rating = require('rating')
import Comment = require('comment')
import Discussion = require('discussion')
import QueryState = require('querystate');

import KElement = require('kelement');

export class ViewModel extends KElement.ViewModel {
	public queryState: Obs.Observable<QueryState.QueryState>;
	
	public childKas: Obs.ObservableArray<Kernaussage.ViewModel>;
	public newKaFormVisible: Obs.Observable<boolean>;
	public newKaClick: () => void;
	public newKaSubmit: () => void;
	public newKaTitle: Obs.Observable<string>;
	public newKaText: Obs.Observable<string>;
	public newKaContext: Obs.Observable<string>;
}