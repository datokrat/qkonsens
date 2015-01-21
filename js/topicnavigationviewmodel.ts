import Obs = require('observable');
import Topic = require('topic');
import QueryState = require('querystate');

export class ViewModel {
	public breadcrumb: Obs.Observable<Topic.ViewModel[]>;
	public selected: Obs.Observable<Topic.ViewModel>;
	public children: Children;
	public kokis: Kokis;
	
	public clickCreateNewKoki: () => void;
}

export class KokiItem {
	public caption: Obs.Observable<string>;
	public click: () => void;
}

export class QueryableItemCollection<T> {
	items: Obs.ObservableArray<T>;
	queryState: Obs.ObservableArray<QueryState.QueryState>;
}

export class Kokis extends QueryableItemCollection<KokiItem> {}
export class Children extends QueryableItemCollection<Topic.ViewModel> {}