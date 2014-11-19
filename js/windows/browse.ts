import Obs = require('../observable');
import Frame = require('../frame');
import Topic = require('../topic');
import TopicNavigationViewModel = require('../topicnavigationviewmodel');

export class Win extends Frame.Win {
	constructor() {
		super('browse-win-template', null);
	}
	
	public navigation: Obs.Observable<TopicNavigationViewModel.ViewModel>;
}