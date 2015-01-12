import Commands = require('command');

import TopicNavigationModel = require('topicnavigationmodel');
import Topic = require('topic');

import WindowViewModel = require('windowviewmodel');
import BrowseWin = require('windows/browse');

export class Controller {
	constructor(resources: Resources) {
		this.resources = resources;
		
		this.initTopicNavigation();
		this.initBrowseWin();
	}
	
	public dispose() {
		this.browseWinController.dispose();
	}
	
	private initTopicNavigation() {
		var rootTopic = new Topic.Model();
		rootTopic.id = { root: true, id: undefined };
		rootTopic.text('[root]');
		this.resources.topicNavigationModel.history.push(rootTopic);
	}
	
	private initBrowseWin() {
		this.browseWin = new BrowseWin.Win();
		this.browseWinController = new BrowseWin.Controller
			(this.resources.topicNavigationModel, this.browseWin, this.resources.topicCommunicator, this.resources.commandProcessor);
		
		this.resources.windowViewModel.fillFrameWithWindow(WindowViewModel.Frame.Right, this.browseWin);
	}
	
	private resources: Resources;
	private browseWin: BrowseWin.Win;
	private browseWinController: BrowseWin.Controller;
}

export class Resources {
	public topicNavigationModel: TopicNavigationModel.Model;
	public topicCommunicator: Topic.Communicator;
	public windowViewModel: WindowViewModel.Main;
	public commandProcessor: Commands.CommandProcessor;
}