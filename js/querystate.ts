import Obs = require('observable');

export class QueryState {
	public error: Obs.Observable<string> = ko.observable<string>();
	public loading: Obs.Observable<boolean> = ko.observable<boolean>();
	
	public set(rhs: QueryState) {
		this.error(rhs.error());
		this.loading(rhs.loading());
	}
}