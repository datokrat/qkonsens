import Obs = require('observable');

export class Model {
	public userName: string;
	
	public constructor(args = { userName: 'anonymous' }) {
		this.userName = args.userName;
	}
	
	public eq(other: Model): boolean {
		return other.userName == this.userName;
	}
}

export class ViewModel { 
	public userName: Obs.Observable<string>;
	public isAdmin: Obs.Observable<boolean>;
	public availableAccounts: Obs.ObservableArray<string>;
}