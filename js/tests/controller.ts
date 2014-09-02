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
	
	testTopicNavigation() {
		var cxt = this.factory.create();
		
		cxt.model.topicNavigation.appendChild( this.topicFactory.create('root') );
		
		this.areIdentical( cxt.viewModel.topicNavigation.breadcrumb()[0], 'root' );
	}
	
	testLeftWinContainer() {
		var cxt = this.factory.create();
		
		test.assert( () => cxt.viewModel.left != null );
		test.assert( () => cxt.viewModel.right != null );
		test.assert( () => cxt.viewModel.center.win() instanceof kokiWin.Win );
	}
	
	testKonsenskiste() {
		var cxt = this.factory.create();
		
		cxt.model.konsenskiste(new koki.Model());
		cxt.model.konsenskiste().content.title('Hi!');
		
		var konsenskisteWindow = <kokiWin.Win>cxt.viewModel.center.win();
		test.assert( () => konsenskisteWindow.kkView().content().title() == 'Hi!' )
	}
	
	testCommunicatorConnection() {
		var cxt = this.factory.create();
		
		var oldKoki = new koki.Model;
		oldKoki.id = 1;
		
		cxt.model.konsenskiste(oldKoki);
		
		var newKoki = new koki.Model;
		newKoki.content.title('hi');
		newKoki.content.text('ho');
		cxt.communicator.konsenskiste.content.retrieved.raise({ id: 1, content: newKoki.content });
		
		var konsenskisteWindow = <kokiWin.Win>cxt.viewModel.center.win();
		test.assert( () => konsenskisteWindow.kkView().content().title() == 'hi' );
		test.assert( () => konsenskisteWindow.kkView().content().text() == 'ho' );
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