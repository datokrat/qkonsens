import Obs = require('../observable');
import Frame = require('../frame');
import Topic = require('../topic');
import TopicNavigationModel = require('../topicnavigationmodel');
import TopicNavigationViewModel = require('../topicnavigationviewmodel');
import TopicNavigationController = require('../topicnavigationcontroller');

export class Win extends Frame.Win {
	constructor() {
		super('browse-win-template', null);
	}
	
	public navigation: Obs.Observable<TopicNavigationViewModel.ViewModel>;
}

export class Controller {
	constructor(model: TopicNavigationModel.Model, win: Win, communicator: Topic.Communicator) {
		win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
		this.navigationController = new TopicNavigationController.Controller(model, win.navigation(), communicator);
	}
	
	private navigationController: TopicNavigationController.Controller;
}