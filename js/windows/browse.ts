import Obs = require('../observable');
import Frame = require('../frame');
import Topic = require('../topic');
import TopicNavigationModel = require('../topicnavigationmodel');
import TopicNavigationViewModel = require('../topicnavigationviewmodel');
import TopicNavigationController = require('../topicnavigationcontroller');
import Commands = require('../command');

export class Win extends Frame.Win {
	constructor() {
		super('browse-win-template', null);
	}
	
	public navigation: Obs.Observable<TopicNavigationViewModel.ViewModel>;
}

export class Controller {
	constructor(model: TopicNavigationModel.Model, win: Win, communicator: Topic.Communicator, commandControl?: Commands.CommandControl) {
		this.commandControl.commandProcessor.parent = commandControl.commandProcessor;
		this.commandControl.commandProcessor.chain.append(cmd => {
			return false;
		});
		
		win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
		this.navigationController = new TopicNavigationController.Controller(model, win.navigation(), 
			{ communicator: communicator, commandControl: this.commandControl });
	}
	
	public dispose() {
		this.navigationController.dispose();
	}
	
	public commandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor() };
	
	private navigationController: TopicNavigationController.Controller;
}