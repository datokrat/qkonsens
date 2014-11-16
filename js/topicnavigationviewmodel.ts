import Obs = require('observable');
import Topic = require('topic');

export class ViewModel {
	public breadcrumb: Obs.Observable<string[]>;
}