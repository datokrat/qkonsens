import Frame = require('../frame');
import Obs = require('../observable');

import ContentViewModel = require('../contentviewmodel');
import Comment = require('../comment');

import DiscussionCommunicator = require('../discussioncommunicator');

export interface DiscussableViewModel {
	general: Obs.Observable<ContentViewModel.General>;
	comments: Obs.ObservableArray<Comment.ViewModel>;
}

export interface DiscussableModel {
	id: Obs.Observable<number>;
}

export interface State {
	discId: number;
}

export class Win extends Frame.Win {
	constructor() {
		super('discussion-win-template', null);
	}

	public discussable: Obs.Observable<DiscussableViewModel> = ko.observable<DiscussableViewModel>();
}