import unit = require('tests/asyncunit')
import test = require('tests/test')

import common = require('../common')

import ContentCommunicator = require('../contentcommunicator')
import TestContentCommunicator = require('tests/testcontentcommunicator')

import ContentModel = require('../contentmodel')
import ContentViewModel = require('../contentviewmodel')
import ContentController = require('../contentcontroller')

class TestClass extends unit.TestClass {
	private com: TestContentCommunicator;
	private mdl: ContentModel.Model;
	private vm: ContentViewModel.ViewModel;
	private ctr: ContentController.Controller;

	setUp(r) {
		this.com = new TestContentCommunicator;
		this.mdl = new ContentModel.Model;
		this.vm = new ContentViewModel.ViewModel;
		this.ctr = new ContentController.Controller( this.mdl, this.vm, this.com );
		r();
	}
	
	queryContent(cxt, r) {
		common.Callbacks.batch([
			r => {
				var content1 = new ContentModel.Model;
				content1.id = 1;
				content1.title('Title #1');
				content1.text('Text #1');
				
				var content2 = new ContentModel.Model;
				content2.id = 2;
				content2.title('Title #2');
				content2.text('Text #2');
				
				this.mdl.id = 1;
				
				this.com.setTestContent(content1);
				this.com.setTestContent(content2);
				this.com.queryContent(1);
				this.com.queryContent(2);
				
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.mdl.title() == 'Title #1' );
				test.assert( () => this.mdl.text() == 'Text #1' );
				r();
			}
		], r);
	}
}

export = TestClass;