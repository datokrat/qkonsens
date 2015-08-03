import topicNavigation = require('topicnavigationmodel')
import konsenskiste = require('konsenskistemodel')
import Account = require('account');

export interface Model {
	//topicNavigation: topicNavigation.Model;
	//konsenskiste: KnockoutObservable<konsenskiste.Model>;
	account: KnockoutObservable<Account.Model>;
}

export class ModelImpl implements Model {
	topicNavigation: topicNavigation.Model = new topicNavigation.ModelImpl;
	konsenskiste = ko.observable<konsenskiste.Model>();
	account = ko.observable<Account.Model>(new Account.Model);
}