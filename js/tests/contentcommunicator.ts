import unit = require('tests/asyncunit')
import test = require('tests/test')

import common = require('../common')

import ContentCommunicator = require('../contentcommunicator')
import TestContentCommunicator = require('tests/testcontentcommunicator')

import ContentModel = require('../contentmodel')
import ContentViewModel = require('../contentviewmodel')
import ContentController = require('../contentcontroller')

import ContentModelFactory = require('factories/contentmodel')

class TestClass extends unit.TestClass {
	private contentModelFactory = new ContentModelFactory;
	
	private com: TestContentCommunicator;
	private mdl: ContentModel.General;
	private vm: ContentViewModel.General;
	private ctr: ContentController.General;
	
	private content1: ContentModel.General;
	private content2: ContentModel.General;

	setUp(r) {
		this.com = new TestContentCommunicator;
		this.mdl = new ContentModel.General;
		this.vm = new ContentViewModel.General;
		this.ctr = new ContentController.General( this.mdl, this.vm, this.com );
		
		this.content1 = this.contentModelFactory.createGeneralContent('Text #1', 'Title #1');
		this.content1.id = 1;
		this.content2 = this.contentModelFactory.createGeneralContent('Text #2', 'Title #2');
		this.content2.id = 2;
		
		this.com.setGeneralTestContent(this.content1);
		this.com.setGeneralTestContent(this.content2);
		r();
	}
	
	queryContent(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.mdl.id = 1;
				this.com.queryGeneral(1);
				setTimeout(r);
			},
			r => {
				this.com.queryGeneral(2);
				setTimeout(r);
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