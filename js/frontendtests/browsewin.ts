import unit = require('tests/asyncunit');
import test = require('tests/test');
import reloader = require('frontendtests/reloader');
import webot = require('frontendtests/webot');
import common = require('../common');
import Obs = require('../observable');

import Win = require('windows/browse');
import Topic = require('../topic');
import TopicNavigationModel = require('../topicnavigationmodel');
import TopicNavigationViewModel = require('../topicnavigationviewmodel');

export class Tests extends unit.TestClass {
	private webot = new webot.Webot();
	
	view(cxt, r) {
		var win = new Win.Win();
		
		common.Callbacks.batch([
			r => {
				win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
				win.navigation().breadcrumb = ko.observableArray<Topic.ViewModel>([]);
				win.parentTopic = ko.observable<Topic.ParentViewModel>(new Topic.ParentViewModel);
				win.parentTopic().caption = ko.observable<string>('Topic 1');
				win.parentTopic().description = ko.observable<string>('Description');
				win.parentTopic().children = ko.observableArray([new Topic.ViewModel]);
				
				win.parentTopic().children()[0].caption = ko.observable('Child 1');
				win.parentTopic().children()[0].click = () => {};
					
				reloader.viewModel().right.win(win);
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('.win:contains("Themen")').child('*').text('Topic 1').exists());
				test.assert(() => this.webot.query('.win:contains("Themen")').child('*').text('Description').exists());
				r();
			}
		], r);
	}
	
	viewMVC(cxt, r) {
		var topicModel = new Topic.ParentModel();
		var topicViewModel = new Topic.ParentViewModel();
		var topicController = new Topic.ParentController(topicModel, topicViewModel);
		
		common.Callbacks.batch([
			r => {
				topicModel.properties().title('Parent Title');
				
				var win = new Win.Win();
				win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
				win.navigation().breadcrumb = ko.observableArray<Topic.ViewModel>([]);
				win.parentTopic = ko.observable(topicViewModel);
				
				reloader.viewModel().right.win(win);
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('.win').child('*').text('Parent Title').exists());
				r();
			}
		], r);
	}
	
	navigation(cxt, r) {
		var win = new Win.Win();
		var topicModel = new Topic.ParentModel();
		var topicViewModel = new Topic.ParentViewModel();
		var topicController = new Topic.ParentController(topicModel, topicViewModel);
		
		common.Callbacks.batch([
			r => {
				topicModel.properties().title('Parent Title');
				win.navigation = ko.observable<TopicNavigationViewModel.ViewModel>();
				win.navigation(new TopicNavigationModel.ModelImpl());
				win.navigation().breadcrumb = ko.observableArray([new Topic.ViewModel]);
				win.navigation().breadcrumb()[0].caption = ko.observable('Breadcrumb Topic 1');
				win.navigation().breadcrumb()[0].click = () => {};
				win.parentTopic = ko.observable(topicViewModel);
				reloader.viewModel().right.win(win);
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('.win:contains("Themen")').child('*').text('Breadcrumb Topic 1').exists());
				r();
			}
		], r);
	}
}