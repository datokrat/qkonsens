import topicNavigation = require('topicnavigationmodel')
import konsenskiste = require('konsenskistemodel')

export interface Model {
	topicNavigation: topicNavigation.Model;
	konsenskiste: KnockoutObservable<konsenskiste.Model>;
	account: KnockoutObservable<Account>;
}

export class ModelImpl implements Model {
	topicNavigation: topicNavigation.Model = new topicNavigation.ModelImpl;
	
	konsenskiste = ko.observable<konsenskiste.Model>();
	
	account = ko.observable<Account>(new Account);
}

export class Account {
	public userName: string;
	
	public constructor(args = { userName: 'anonymous' }) {
		this.userName = args.userName;
	}
	
	public eq(other: Account): boolean {
		return other.userName == this.userName;
	}
}