import unit = require('tests/tsunit')
import test = require('tests/test')

import mdl = require('../model')
import vm = require('../viewmodel')
import ctr = require('../controller')

import koki = require('../konsenskistemodel')
import tpc = require('../topic')

import kokiWin = require('../windows/konsenskiste')

import TestCommunicator = require('tests/testcommunicator')

export class Tests extends unit.TestClass {
	private factory = new Factory();
	private topicFactory = new TopicFactory();
	private cxt: { model: mdl.Model; viewModel: vm.ViewModel; communicator: TestCommunicator; controller: ctr.Controller };
	
	setUp() {
		this.cxt = this.factory.create();
	}
	
	tearDown() {
		this.cxt.controller.dispose();
	}
	
	testTopicNavigation() {
		this.cxt.model.topicNavigation.appendChild( this.topicFactory.create('root') );
		
		this.areIdentical( this.cxt.viewModel.topicNavigation.breadcrumb()[0], 'root' );
	}
	
	testLeftWinContainer() {
		test.assert( () => this.cxt.viewModel.left != null );
		test.assert( () => this.cxt.viewModel.right != null );
		test.assert( () => this.cxt.viewModel.center.win() instanceof kokiWin.Win );
	}
	
	testKonsenskiste() {
		this.cxt.model.konsenskiste(new koki.Model());
		this.cxt.model.konsenskiste().general().title('Hi!');
		
		var konsenskisteWindow = <kokiWin.Win>this.cxt.viewModel.center.win();
		test.assert( () => konsenskisteWindow.kkView().general().title() == 'Hi!' )
	}
	
	testCommunicatorConnection() {
		var oldKoki = new koki.Model;
		oldKoki.id(1);
		
		this.cxt.model.konsenskiste(oldKoki);
		
		var newKoki = new koki.Model;
		newKoki.general().title('hi');
		newKoki.general().text('ho');
		this.cxt.communicator.konsenskiste.content.generalContentRetrieved.raise({ general: newKoki.general() });
		
		var konsenskisteWindow = <kokiWin.Win>this.cxt.viewModel.center.win();
		test.assert( () => konsenskisteWindow.kkView().general().title() == 'hi' );
		test.assert( () => konsenskisteWindow.kkView().general().text() == 'ho' );
	}
	
	testLoadKonsenskiste() {
		var oldKoki = new koki.Model;
		oldKoki.id(1);
		var newKoki = new koki.Model;
		newKoki.id(1);
		newKoki.general().title('hi');
		this.cxt.model.konsenskiste(oldKoki);
		
		this.cxt.communicator.konsenskiste.received.raise({ id: 1, konsenskiste: newKoki });
		
		var konsenskisteWindow = <kokiWin.Win>this.cxt.viewModel.center.win();
		test.assert( () => konsenskisteWindow.kkView().general().title() == 'hi' );
	}
	
	testCommunicatorDisposal() {
		test.assert( () => !"not implemented" );
	}
}

class Factory {
	public create() {
		var model: mdl.Model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var communicator = new TestCommunicator();
		var controller = new ctr.Controller(model, viewModel, communicator);
		
		return { model: model, viewModel: viewModel, communicator: communicator, controller: controller };
	}
}

class TopicFactory {
	public create(title: string) {
		var topic = new tpc.Topic();
		topic.title(title);
		return topic;
	}
}