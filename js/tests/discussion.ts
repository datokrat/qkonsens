import unit = require('tests/tsunit');
import test = require('tests/test');
import frame = require('../frame');

import Discussion = require('../discussion');
import DiscussionCommunicator = require('tests/testdiscussioncommunicator');
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
	
	tearDown() {
		this.controller.dispose();
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
	
	queryCommentsOfNonExistantId() {
		var errorCtr = 0;
		var receivedCtr = 0;
		this.communicator.commentsReceived.subscribe(() => ++receivedCtr);
		this.communicator.commentsReceiptError.subscribe(() => ++errorCtr);
		
		this.communicator.queryCommentsOf(3);
		
		test.assert(() => errorCtr == 1);
		test.assert(() => receivedCtr == 0);
	}
	
	receiveCommentsFromCommunicator() {
		this.communicator.commentsReceived.raise({ id: 2, comments: this.discussable.discussion().comments.get() });
		
		test.assert( () => this.model.comments.get().length == 1 );
	}
	
	appendComment() {
		var comment = new Comment.Model();
		var successCtr = 0, errorCtr = 0, receiptCtr = 0;
		
		this.communicator.setTestDiscussable({ id: ko.observable(2), discussion: ko.observable(new Discussion.Model()) });
		this.communicator.commentAppended.subscribe(args => ++successCtr);
		this.communicator.commentAppendingError.subscribe(args => ++errorCtr);
		this.communicator.appendComment(2, comment);
		
		test.assert(() => successCtr == 1);
		test.assert(() => errorCtr == 0);
		
		this.communicator.commentsReceived.subscribe(args => {
			++receiptCtr;
			test.assert(() => args.comments.length == 1);
		});
		this.communicator.queryCommentsOf(2);
		
		test.assert(() => receiptCtr == 1);
	}
	
	communicatorRemoveComment() {
		var serverDiscussable = { id: ko.observable(2), discussion: ko.observable(new Discussion.Model()) };
		serverDiscussable.discussion().comments.push(new Comment.Model);
		serverDiscussable.discussion().comments.get()[0].id = 10;
		
		var successCtr = 0, errorCtr = 0;
		this.communicator.setTestDiscussable(serverDiscussable);
		this.communicator.commentRemoved.subscribe(args => ++successCtr);
		this.communicator.commentRemovalError.subscribe(args => ++errorCtr);
		
		this.communicator.removeComment({ discussableId: 2, commentId: 10 });
		
		test.assert(() => successCtr == 1);
		test.assert(() => errorCtr == 0);
		test.assert(() => serverDiscussable.discussion().comments.get().length == 0);
	}
	
	communicatorRemoveNonExistantComment() {
		var serverDiscussable = { id: ko.observable(2), discussion: ko.observable(new Discussion.Model()) };
		
		var successCtr = 0, errorCtr = 0;
		this.communicator.setTestDiscussable(serverDiscussable);
		this.communicator.commentRemoved.subscribe(args => ++successCtr);
		this.communicator.commentRemovalError.subscribe(args => ++errorCtr);
		
		this.communicator.removeComment({ discussableId: 2, commentId: 10 });
		
		test.assert(() => successCtr == 0);
		test.assert(() => errorCtr == 1);
		test.assert(() => serverDiscussable.discussion().comments.get().length == 0);
	}
	
	communicatorRemoveCommentOfNonExistant() {
		var successCtr = 0;
		var errorCtr = 0;
		this.communicator.commentRemoved.subscribe(args => ++successCtr);
		this.communicator.commentRemovalError.subscribe(args => ++errorCtr);
		
		this.communicator.removeComment({ discussableId: 2, commentId: 10 });
		
		test.assert(() => successCtr == 0);
		test.assert(() => errorCtr == 1);
	}
	
	controllerRemoveComment() {
		console.log('controllerRemoveComment');
		var model = new Discussion.Model();
		var viewModel = new Discussion.ViewModel();
		var communicator = new DiscussionCommunicator();
		var controller = new Discussion.Controller(model, viewModel, communicator);
		controller.setDiscussableModel({ id: ko.observable(2), discussion: ko.observable(model) });
		
		var serverDiscussable = { id: ko.observable(2), discussion: ko.observable(new Discussion.Model) };
		var serverComment = new Comment.Model(); serverComment.id = 13;
		serverDiscussable.discussion().comments.push(serverComment);
		communicator.setTestDiscussable(serverDiscussable);
		
		var comment = new Comment.Model(); comment.id= 13;
		model.comments.push(comment);
		viewModel.comments()[0].removeClick();
		
		test.assert(() => viewModel.comments().length == 0);
	}
}

export = TestClass;