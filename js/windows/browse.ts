import Obs = require('../observable');
import Frame = require('../frame');
import Topic = require('../topic');

export class Win extends Frame.Win {
	constructor() {
		super('browse-win-template', null);
	}
	
	public parentTopic: Obs.Observable<Topic.ParentViewModel>;
}