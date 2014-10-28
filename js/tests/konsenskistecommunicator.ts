import unit = require('tests/asyncunit')
import test = require('tests/test')

import common = require('../common')

import TestKokiCommunicator = require('tests/testkonsenskistecommunicator')
import KonsenskisteModel = require('../konsenskistemodel')
import KokiViewModel = require('../konsenskisteviewmodel')
import KokiController = require('../konsenskistecontroller')
import Comment = require('comment')

class TestClass extends unit.TestClass {
	private com: TestKokiCommunicator;
	private mdl: KonsenskisteModel.Model;
	private vm: KokiViewModel.ViewModel;
	private ctr: KokiController.Controller;

	setUp(r) {
		this.com = new TestKokiCommunicator;
		this.mdl = new KonsenskisteModel.Model;
		this.vm = new KokiViewModel.ViewModel;
		this.ctr = new KokiController.ControllerImpl( this.mdl, this.vm, this.com );
		r();
	}
	
	queryKoki(cxt, r) {
		common.Callbacks.batch([
			r => {
				var koki1 = new KonsenskisteModel.Model;
				koki1.id(1);
				koki1.general().title('Title #1');
				koki1.general().text('Text #1');
				
				var koki2 = new KonsenskisteModel.Model;
				koki2.id(2);
				koki2.general().title('Title #2');
				koki2.general().text('Text #2');
				
				this.mdl.id(1);
				
				this.com.setTestKoki(koki1);
				this.com.setTestKoki(koki2);
				this.com.queryKoki(1);
				this.com.queryKoki(2);
				
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.mdl.general().title() == 'Title #1' );
				test.assert( () => this.mdl.general().text() == 'Text #1' );
				r();
			},
		], r);
	}
	
	queryComments(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.mdl.id(1);
				var koki = new KonsenskisteModel.Model();
				koki.id(1);
				koki.discussion().comments.set([new Comment.Model]);
				
				var ctr = 0;
				this.com.discussion.commentsReceived.subscribe(args => {
					test.assert(() => args.comments.length == 1);
					++ctr;
				});
				this.com.setTestKoki(koki);
				this.com.discussion.queryCommentsOf(1);
				
				test.assert(() => ctr == 1);
				r();
			}
		], r);
	}
	
	receiveCommentsFromCommunicator(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.mdl.id(1);
				this.com.discussion.commentsReceived.raise({ id: 1, comments: [new Comment.Model] });
				test.assert(() => this.mdl.discussion().comments.get().length == 1);
				r();
			}
		], r);
	}
	
	communicator(cxt, r) {
		var communicator = new TestKokiCommunicator();
		communicator.discussion.commentsReceived.subscribe(args => test.assert(() => args.comments.length == 1) );
		
		var koki = new KonsenskisteModel.Model();
		koki.id(1);
		koki.discussion().comments.set([new Comment.Model]);
		communicator.setTestKoki(koki);
		communicator.discussion.queryCommentsOf(1);
		
		r();
	}
	
	queryNonExistantKoki(cxt, r) {
		var errorCtr = 0;
		var successCtr = 0;
		var koki: KonsenskisteModel.Model;
		this.com.receiptError.subscribe(args => {
			test.assert(() => args.konsenskiste.error() && true);
			++errorCtr;
		});
		this.com.received.subscribe(args => ++successCtr);
		
		koki = this.com.queryKoki(369);
		
		test.assert(() => successCtr == 0);
		test.assert(() => errorCtr == 1);
		
		r();
	}
}

export = TestClass;