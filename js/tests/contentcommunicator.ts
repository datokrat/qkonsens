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
	private generalModel: ContentModel.General;
	private generalViewModel: ContentViewModel.General;
	private generalController: ContentController.General;
	private contextModel: ContentModel.Context;
	private contextViewModel: ContentViewModel.Context;
	private contextController: ContentController.Context;
	
	private content1: ContentModel.General;
	private content2: ContentModel.General;
	private context1: ContentModel.Context;

	setUp(r) {
		this.com = new TestContentCommunicator;
		this.generalModel = new ContentModel.General;
		this.generalViewModel = new ContentViewModel.General;
		this.generalController = new ContentController.General( this.generalModel, this.generalViewModel, this.com );
		this.contextModel = new ContentModel.Context;
		this.contextViewModel = new ContentViewModel.Context;
		this.contextController = new ContentController.Context( this.contextModel, this.contextViewModel, this.com );
		
		this.content1 = this.contentModelFactory.createGeneralContent('Text #1', 'Title #1');
		this.content1.id = 1;
		this.content2 = this.contentModelFactory.createGeneralContent('Text #2', 'Title #2');
		this.content2.id = 2;
		
		this.context1 = this.contentModelFactory.createContext('Context #1');
		this.context1.id = 10;
		
		this.com.setGeneralTestContent(this.content1);
		this.com.setGeneralTestContent(this.content2);
		this.com.setTestContext(this.context1);
		r();
	}
	
	queryContent(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.generalModel.id = 1;
				this.contextModel.id = 10;
				this.com.queryGeneral(1);
				this.com.queryContext(10);
				setTimeout(r);
			},
			r => {
				this.com.queryGeneral(2);
				setTimeout(r);
			},
			r => {
				test.assert( () => this.generalModel.title() == 'Title #1' );
				test.assert( () => this.generalModel.text() == 'Text #1' );
				test.assert( () => this.contextModel.text() == 'Context #1' );
				r();
			}
		], r);
	}
}

export = TestClass;