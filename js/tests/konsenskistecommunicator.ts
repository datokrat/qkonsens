import unit = require('tests/asyncunit')
import test = require('tests/test')

import common = require('../common')

import TestKokiCommunicator = require('tests/testkonsenskistecommunicator')
import KonsenskisteModel = require('../konsenskistemodel')
import KokiViewModel = require('../konsenskisteviewmodel')
import KokiController = require('../konsenskistecontroller')
import Comment = require('../comment')

class TestClass extends unit.TestClass {
	private com: TestKokiCommunicator.Main;
	private mdl: KonsenskisteModel.Model;
	private vm: KokiViewModel.ViewModel;
	private ctr: KokiController.Controller;

	setUp(r) {
		this.com = new TestKokiCommunicator.Main();
		this.mdl = new KonsenskisteModel.Model;
		this.vm = new KokiViewModel.ViewModel;
		this.ctr = new KokiController.ControllerImpl( this.mdl, this.vm, {communicator: this.com, commandProcessor: null} );
		r();
	}
	
	queryKoki(async, r) {
		async();
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
				this.com.query(1);
				this.com.query(2);
				
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.mdl.queryState().loading() == false );
				test.assert( () => !this.mdl.queryState().error() );
				test.assert( () => this.mdl.general().title() == 'Title #1' );
				test.assert( () => this.mdl.general().text() == 'Text #1' );
				r();
			},
		], r);
	}
	
	queryComments(async, r) {
		async();
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
	
	receiveCommentsFromCommunicator(async, r) {
		async();
		common.Callbacks.batch([
			r => {
				this.mdl.id(1);
				this.com.discussion.commentsReceived.raise({ id: 1, comments: [new Comment.Model] });
				test.assert(() => this.mdl.discussion().comments.get().length == 1);
				r();
			}
		], r);
	}
	
	communicator(async, r) {
		async();
		var communicator = new TestKokiCommunicator.Main();
		communicator.discussion.commentsReceived.subscribe(args => test.assert(() => args.comments.length == 1) );
		
		var koki = new KonsenskisteModel.Model();
		koki.id(1);
		koki.discussion().comments.set([new Comment.Model]);
		communicator.setTestKoki(koki);
		communicator.discussion.queryCommentsOf(1);
		
		r();
	}
	
	queryNonExistantKoki(async, r) {
		async();
		var errorCtr = 0;
		var successCtr = 0;
		var koki: KonsenskisteModel.Model;
		this.com.receiptError.subscribe(args => {
			test.assert(() => args.konsenskiste.queryState().error() && true);
			++errorCtr;
		});
		this.com.received.subscribe(args => ++successCtr);
		
		koki = this.com.query(369);
		
		test.assert(() => successCtr == 0);
		test.assert(() => errorCtr == 1);
		
		r();
	}
	
	createKoki(async, r) {
		async();
		this.com.create({ text: 'Text', title: 'Title' }, null, id => {
			r();
		});
	}
}

export = TestClass;