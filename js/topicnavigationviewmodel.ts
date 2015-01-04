import Obs = require('observable');
import Topic = require('topic');

export class ViewModel {
	public breadcrumb: Obs.Observable<Topic.ViewModel[]>;
	public selected: Obs.Observable<Topic.ViewModel>;
	public children: Obs.ObservableArray<Topic.ViewModel>;
	public kokis: Obs.ObservableArray<KokiItem>;
}

export class KokiItem {
	public caption: Obs.Observable<string>;
	public click: () => void;
}