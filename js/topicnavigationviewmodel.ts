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

export class QueryableItemCollectionBase {
	items: Obs.ObservableArray<any>;
	queryState: Obs.Observable<QueryState.QueryState>;
}

export class QueryableItemCollection<T> implements QueryableItemCollectionBase {
	items: Obs.ObservableArray<T>;
	queryState: Obs.Observable<QueryState.QueryState>;
}

export class Kokis extends QueryableItemCollection<KokiItem> {}
export class Children extends QueryableItemCollection<Topic.ViewModel> {}