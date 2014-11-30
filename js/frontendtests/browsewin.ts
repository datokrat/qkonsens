import unit = require('tests/asyncunit');
import test = require('tests/test');
import reloader = require('frontendtests/reloader');
import webot = require('frontendtests/webot');
import common = require('../common');
import Evt = require('../event');
import Obs = require('../observable');

import Win = require('windows/browse');
import Topic = require('../topic');
import TopicFactory = require('factories/topic');
import TopicCommunicator = require('tests/testtopiccommunicator');
import TopicNavigationModel = require('../topicnavigationmodel');
import TopicNavigationViewModel = require('../topicnavigationviewmodel');
import TopicNavigationController = require('../topicnavigationcontroller');

export class Tests extends unit.TestClass {
	private webot = new webot.Webot();
	
	view(cxt, r) {
		var win = new Win.Win();
		
		common.Callbacks.batch([
			r => {
				win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
				win.navigation().breadcrumb = ko.observableArray<Topic.ViewModel>([]);
				win.navigation().selected = ko.observable<Topic.ViewModel>(new Topic.ViewModel);
				win.navigation().selected().caption = ko.observable<string>('Topic 1');
				win.navigation().selected().description = ko.observable<string>('Description');
				
				win.navigation().children = ko.observableArray([new Topic.ViewModel]);
				win.navigation().children()[0].caption = ko.observable('Child 1');
				win.navigation().children()[0].click = new Evt.EventImpl<void>();
					
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
		var topicModel = new Topic.Model();
		var topicViewModel = new Topic.ViewModel();
		var topicController = new Topic.ModelViewModelController(topicModel, topicViewModel);
		
		common.Callbacks.batch([
			r => {
				topicModel.title('Parent Title');
				
				var win = new Win.Win();
				win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
				win.navigation().breadcrumb = ko.observableArray<Topic.ViewModel>([]);
				win.navigation().selected = ko.observable(topicViewModel);
				win.navigation().children = ko.observableArray([]);
				
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
		var topicModel = new Topic.Model();
		var topicViewModel = new Topic.ViewModel();
		var topicController = new Topic.ModelViewModelController(topicModel, topicViewModel);
		
		common.Callbacks.batch([
			r => {
				topicModel.title('Parent Title');
				win.navigation = ko.observable<TopicNavigationViewModel.ViewModel>();
				win.navigation(new TopicNavigationViewModel.ViewModel());
				win.navigation().breadcrumb = ko.observableArray([new Topic.ViewModel]);
				win.navigation().breadcrumb()[0].caption = ko.observable('Breadcrumb Topic 1');
				win.navigation().breadcrumb()[0].click = new Evt.EventImpl<void>();
				win.navigation().selected = ko.observable(topicViewModel);
				win.navigation().children = ko.observableArray([]);
				reloader.viewModel().right.win(win);
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('.win:contains("Themen")').child('*').text('Breadcrumb Topic 1').exists());
				r();
			}
		], r);
	}
	
	navigationUseCase(cxt, r) {
		var win = new Win.Win();
		var topicCommunicator = new TopicCommunicator.Main();
		var topicNavigationModel = new TopicNavigationModel.ModelImpl();
		var topicNavigationViewModel = new TopicNavigationViewModel.ViewModel();
		var topicNavigationController = new TopicNavigationController.Controller(topicNavigationModel, topicNavigationViewModel, topicCommunicator);
		
		topicCommunicator.setTestChildren({ id: 3 }, [TopicFactory.Main.create({ id: 5, text: 'Topic 5' })]);
		
		var topic0 = TopicFactory.Main.create({ id: 0, text: 'Topic 0' });
		var topic3 = TopicFactory.Main.create({ id: 3, text: 'Topic 3' });
		topicNavigationModel.history.set([topic3, topic0]);
		
		win.navigation = ko.observable(topicNavigationViewModel);
		common.Callbacks.batch([
			r => {
				reloader.viewModel().right.win(win);
				setTimeout(r);
			}, r => {
				this.webot.query('.win').contains('Themen').child('*').text('Topic 3').click();
				setTimeout(r);
			}, r => {
				test.assert(() => this.webot.query('.win').contains('Themen').child('*').text('Topic 3').exists());
				test.assert(() => this.webot.query('.win').contains('Themen').child('*').text('Topic 5').exists());
				test.assert(() => this.webot.query('.win').contains('Themen').child('*').text('Topic 0').exists(false));
				r();
			}
		], r);
	}
}