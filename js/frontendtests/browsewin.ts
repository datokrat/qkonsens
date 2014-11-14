import unit = require('tests/asyncunit');
import test = require('tests/test');
import reloader = require('frontendtests/reloader');
import Obs = require('../observable');

import Win = require('windows/browse');
import Topic = require('../topic');

export class Tests extends unit.TestClass {
	test(cxt, r) {
		var win = new Win.Win();
		win.parentTopic = ko.observable<Topic.ParentViewModel>(new Topic.ParentViewModel());
		win.parentTopic().caption = ko.observable<string>('Topic 1');
		win.parentTopic().description = ko.observable<string>('Description');
		win.parentTopic().children = ko.observableArray([]);
			
		reloader.viewModel().right.win(win);
		r();
	}
}