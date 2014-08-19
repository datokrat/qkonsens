import topicNavigation = require('topicnavigationmodel')

export interface Model {
	topicNavigation: topicNavigation.Model;
}

export class ModelImpl implements Model {
	topicNavigation: topicNavigation.Model = new topicNavigation.ModelImpl();
}