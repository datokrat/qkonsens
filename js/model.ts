import topicNavigation = require('topicnavigationmodel')
import konsenskiste = require('konsenskistemodel')

export interface Model {
	topicNavigation: topicNavigation.Model;
	konsenskiste: KnockoutObservable<konsenskiste.Model>;
}

export class ModelImpl implements Model {
	topicNavigation: topicNavigation.Model = new topicNavigation.ModelImpl;
	
	konsenskiste = ko.observable<konsenskiste.Model>();
}