import unit = require('tests/tsunit')
import test = require('tests/test')

import Obs = require('../observable')
import Comment = require('../comment')
import DiscussionCommunicator = require('tests/testdiscussioncommunicator')
import CommentSynchronizer = require('synchronizers/comment')

export class Tests extends unit.TestClass {
	test() {
		var models = new Obs.ObservableArrayExtender<Comment.Model>(ko.observableArray<Comment.Model>());
		var viewModels = ko.observableArray<Comment.ViewModel>();
		
		var sync = new CommentSynchronizer(new DiscussionCommunicator)
			.setViewModelObservable(viewModels)
			.setModelObservable(models);
			
		models.push(new Comment.Model);
		
		test.assert( () => viewModels().length == 1 );
	}
	
	setViewModelTwice() {
		var models = new Obs.ObservableArrayExtender<Comment.Model>(ko.observableArray<Comment.Model>());
		models.push(new Comment.Model);
		var viewModels = ko.observableArray<Comment.ViewModel>();
		var viewModels2 = ko.observableArray<Comment.ViewModel>();
		
		var sync = new CommentSynchronizer(new DiscussionCommunicator)
			.setViewModelObservable(viewModels)
			.setModelObservable(models)
			.setViewModelObservable(viewModels2);
			
		test.assert( () => viewModels2().length == 1);
	}
}