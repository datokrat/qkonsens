import unit = require('tests/tsunit')
import test = require('tests/test')

import Comment = require('../comment')
import ContentCommunicatorImpl = require('../contentcommunicatorimpl')
import CommentSynchronizer = require('synchronizers/comment')

export class Tests extends unit.TestClass {
	test() {
		var model = new Comment.Model();
		var insertionCtr = 0;
		var inserted = viewModel => { test.assert( () => insertionCtr++ == 0 ); };
		
		var sync = new CommentSynchronizer(new ContentCommunicatorImpl)
			.setViewModelInsertionHandler( inserted );
		sync.inserted(model);
		
		test.assert( () => insertionCtr == 1 );
	}
}