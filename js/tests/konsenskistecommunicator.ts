import unit = require('tests/asyncunit')
import test = require('tests/test')

import common = require('../common')

import TestKokiCommunicator = require('tests/testkonsenskistecommunicator')
import KokiModel = require('../konsenskistemodel')
import KokiViewModel = require('../konsenskisteviewmodel')
import KokiController = require('../konsenskistecontroller')
import Comment = require('comment')

class TestClass extends unit.TestClass {
	private com: TestKokiCommunicator;
	private mdl: KokiModel.Model;
	private vm: KokiViewModel.ViewModel;
	private ctr: KokiController.Controller;

	setUp(r) {
		this.com = new TestKokiCommunicator;
		this.mdl = new KokiModel.Model;
		this.vm = new KokiViewModel.ViewModel;
		this.ctr = new KokiController.ControllerImpl( this.mdl, this.vm, this.com );
		r();
	}
	
	queryKoki(cxt, r) {
		common.Callbacks.batch([
			r => {
				var koki1 = new KokiModel.Model;
				koki1.id = 1;
				koki1.general().title('Title #1');
				koki1.general().text('Text #1');
				
				var koki2 = new KokiModel.Model;
				koki2.id = 2;
				koki2.general().title('Title #2');
				koki2.general().text('Text #2');
				
				this.mdl.id = 1;
				
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
				this.mdl.id = 1;
				var koki = new KokiModel.Model();
				koki.id = 1;
				koki.comments.set([new Comment.Model]);
				
				this.com.setTestKoki(koki);
				this.com.queryCommentsOf(1);
				
				setTimeout(r);
			},
			r => {
				test.assert( () => this.mdl.comments.get().length == 1 );
				r();
			}
		], r);
	}
}

export = TestClass;