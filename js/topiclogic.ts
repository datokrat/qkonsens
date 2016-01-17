import Commands = require('command');

import TopicNavigationModel = require('topicnavigationmodel');
import Topic = require('topic');

import Windows = require('windows');
import BrowseWin = require('windows/browse');

import Config = require('config');

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
		rootTopic.id = { root: false, id: 575 };
		rootTopic.text('[root]');
		this.resources.topicNavigationModel.history.push(rootTopic);
	}
	
	private initBrowseWin() {
		this.browseWin = new BrowseWin.Win();
		this.browseWinController = new BrowseWin.Controller
			(this.resources.topicNavigationModel, this.browseWin, this.resources.topicCommunicator, this.resources.commandProcessor);
		
		this.resources.windowViewModel.fillFrameWithWindow(Windows.Frame.Right, this.browseWin);
	}
	
	private resources: Resources;
	private browseWin: BrowseWin.Win;
	private browseWinController: BrowseWin.Controller;
}

export class Resources {
	public topicNavigationModel: TopicNavigationModel.Model;
	public topicCommunicator: Topic.Communicator;
	public windowViewModel: Windows.WindowViewModel;
	public commandProcessor: Commands.CommandProcessor;
}