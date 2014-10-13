import unit = require('tests/tsunit');
import test = require('tests/test');
import frame = require('../frame');

import Discussion = require('../discussable');
import DiscussionCommunicator = require('tests/testdiscussablecommunicator');
import Comment = require('../comment');
import ViewModelContext = require('../viewmodelcontext');

class TestClass extends unit.TestClass {
	private model: Discussion.Model;
	private viewModel: Discussion.ViewModel;
	private controller: Discussion.Controller;
	private communicator: DiscussionCommunicator;
	private discussable: Discussion.DiscussableModel;
	
	setUp() {
		this.model = new Discussion.Model();
		this.viewModel = new Discussion.ViewModel();
		this.communicator = new DiscussionCommunicator();
		this.controller = new Discussion.Controller(this.model, this.viewModel, this.communicator);
		
		this.discussable = { id: ko.observable<number>(2), discussion: ko.observable<Discussion.Model>() };
		this.discussable.discussion(new Discussion.Model);
		this.discussable.discussion().comments.set([new Comment.Model]);
		
		this.controller.setDiscussableModel(this.discussable);
	}
	
	queryComments() {
		var ctr = 0;
		this.communicator.setTestDiscussable(this.discussable);
		this.communicator.commentsReceived.subscribe(args => {
			test.assert( () => args.id == 2 );
			test.assert( () => args.comments.length == 1 );
			test.assert( () => ctr == 0 );
			++ctr;
		});
		
		this.communicator.queryCommentsOf(2);
		
		test.assert( () => ctr == 1 );
	}
	
	receiveCommentsFromCommunicator() {
		this.communicator.commentsReceived.raise({ id: 2, comments: this.discussable.discussion().comments.get() });
		
		test.assert( () => this.model.comments.get().length == 1 );
	}
}

export = TestClass;