import Frame = require('frame')
import Obs = require('observable')

import ContentViewModel = require('contentviewmodel')
import Comment = require('comment')

export interface Discussable {
	general: Obs.Observable<ContentViewModel.General>;
	comments: Obs.ObservableArray<Comment.ViewModel>;
}

export class Win extends Frame.Win {
	constructor() {
		super('discussion-win-template', null);
	}
	
	public discussable: Obs.Observable<Discussable> = ko.observable<Discussable>();
}