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
	private mdl: ContentModel.WithContext;
	private vm: ContentViewModel.ViewModel;
	private ctr: ContentController.Controller;
	
	private content1: ContentModel.WithContext;
	private content2: ContentModel.Model;

	setUp(r) {
		this.com = new TestContentCommunicator;
		this.mdl = new ContentModel.WithContext;
		this.vm = new ContentViewModel.ViewModel;
		this.ctr = new ContentController.Controller( this.mdl, this.vm, this.com );
		
		this.content1 = this.contentModelFactory.createWithContext('Text #1', 'Title #1');
		this.content1.id = 1;
		this.content1.context().text('Context #1');
		this.content2 = this.contentModelFactory.create('Text #2', 'Title #2');
		this.content2.id = 2;
		
		this.com.setTestContent(this.content1);
		this.com.setTestContent(this.content2);
		r();
	}
	
	queryContent(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.mdl.id = 1;
				this.com.queryContent(1);
				setTimeout(r);
			},
			r => {
				this.com.queryContent(2);
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