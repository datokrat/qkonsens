import unit = require('tests/tsunit')
import test = require('tests/test')

import Obs = require('../observable')
import Comment = require('../comment')
import ContentCommunicatorImpl = require('../contentcommunicatorimpl')
import CommentSynchronizer = require('synchronizers/comment')

export class Tests extends unit.TestClass {
	test() {
		var models = new Obs.ObservableArrayExtender<Comment.Model>(ko.observableArray<Comment.Model>());
		var insertionCtr = 0;
		var inserted = viewModel => { test.assert( () => insertionCtr++ == 0 ); };
		
		var sync = new CommentSynchronizer(new ContentCommunicatorImpl)
			.setViewModelInsertionHandler( inserted )
			.setModelObservable(models);
			
		models.push(new Comment.Model);
		
		test.assert( () => insertionCtr == 1 );
	}
}