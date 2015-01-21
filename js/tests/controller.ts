import unit = require('tests/tsunit')
import test = require('tests/test')
import common = require('../common');

import mdl = require('../model')
import vm = require('../viewmodel')
import ctr = require('../controller')

import koki = require('../konsenskistemodel')
import tpc = require('../topic')

import kokiWin = require('windows/konsenskiste')
import NewKkWin = require('windows/newkk')
import EditKElementWin = require('windows/editkelement');
import DiscussionWin = require('windows/discussion');
import KonsenskisteModel = require('../konsenskistemodel');
import ContentModel = require('../contentmodel');
import Discussion = require('../discussion');
import KElementCommands = require('../kelementcommands');

import Communicator = require('../communicator')
import TestCommunicator = require('tests/testcommunicator')
import Topic = require('../topic');

import KokiLogic = require('../kokilogic');
import StateLogic = require('../statelogic');

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
	
	testLeftWinContainer() {
		test.assert( () => this.cxt.viewModel.left != null );
		test.assert( () => this.cxt.viewModel.right != null );
		test.assert( () => this.cxt.viewModel.center.win() instanceof kokiWin.Win );
	}
	
	testKonsenskiste() {
		var konsenskiste = new koki.Model();
		konsenskiste.general().title('Hi!');
		this.cxt.controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(konsenskiste));
		
		var konsenskisteWindow = <kokiWin.Win>this.cxt.viewModel.center.win();
		test.assert( () => konsenskisteWindow.kkView().general().title() == 'Hi!' )
	}
	
	testCommunicatorConnection() {
		var oldKoki = new koki.Model;
		oldKoki.id(1);
		
		//this.cxt.model.konsenskiste(oldKoki);
		this.cxt.controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(oldKoki));
		
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
		this.cxt.controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(oldKoki));
		
		this.cxt.communicator.konsenskiste.received.raise({ id: 1, konsenskiste: newKoki });
		
		var konsenskisteWindow = <kokiWin.Win>this.cxt.viewModel.center.win();
		test.assert( () => konsenskisteWindow.kkView().general().title() == 'hi' );
	}
	
	testCommunicatorDisposal() {
		test.assert( () => !"not implemented" );
	}
	
	loginAfterChangingAccount() {
		var counter = new common.Counter();
		var model: mdl.Model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var communicator = new TestCommunicator();
		communicator.commandProcessor.chain.insertAtBeginning(cmd => {
			if(cmd instanceof Communicator.LoginCommand)
				counter.inc('login command');
			return true;
		});
		var controller = new ctr.Controller(model, viewModel, communicator);
		communicator.commandProcessor.chain.insertAtBeginning(cmd => {
			test.assert(v => v.val((<Communicator.LoginCommand>cmd).userName) == 'TheUnnamed');
			return false;
		});
		
		test.assert(v => v.val(counter.get('login command')) == 1);
		
		model.account(new mdl.Account({ userName: 'TheUnnamed' }));
		
		test.assert(v => v.val(counter.get('login command')) == 2);
	}
	
	updateViewModelAfterChangingAccount() {
		this.cxt.model.account(new mdl.Account({ userName: 'TheUnnamed' }));
		
		test.assert(v => this.cxt.viewModel.userName() == 'TheUnnamed');
	}
	
	updateAccountModelAfterChangingAccountViewModel() {
		var counter = new common.Counter();
		this.cxt.model.account.subscribe(() => counter.inc('account changed'));
		
		this.cxt.viewModel.userName('TheUnnamed');
		
		test.assert(v => v.val(this.cxt.model.account().userName) == 'TheUnnamed');
		test.assert(v => v.val(counter.get('account changed')) == 1);
	}
	
	processCreateNewKokiCommand() {
		var counter = new common.Counter();
		this.cxt.communicator.konsenskiste.create = (koki: KonsenskisteModel.Model, parentTopicId: number, then: (id: number) => void) => {
			counter.inc('communicator.create');
			then(2);
		};
		this.cxt.controller.commandProcessor.processCommand(new ctr.CreateNewKokiCommand(new KonsenskisteModel.Model(), new Topic.Model, (id: number) => {
			test.assert(v => v.val(id) == 2);
			counter.inc('then');
		}));
		test.assert(v => v.val(counter.get('then')) == 1);
		test.assert(v => v.val(counter.get('communicator.create')) == 1);
	}
	
	processOpenNewKkWindowCommand() {
		var topic = new tpc.Model();
		topic.title('Parent Topic apgr');
		this.cxt.controller.commandProcessor.processCommand(new ctr.OpenNewKokiWindowCommand(topic));
		test.assert(v => this.cxt.viewModel.left.win() instanceof NewKkWin.Win);
		test.assert(v => (<NewKkWin.Win>this.cxt.viewModel.left.win()).parentName() == 'Parent Topic apgr');
	}
	
	processOpenDiscussionWindowCommand() {
		var discussableViewModel: Discussion.DiscussableViewModel = {
			discussion: ko.observable(new Discussion.ViewModel)
		};
		this.cxt.controller.commandProcessor.processCommand(new ctr.OpenDiscussionWindowCommand(discussableViewModel));
		test.assert(v => this.cxt.viewModel.left.win() instanceof DiscussionWin.Win);
	}
	
	processOpenEditKElementWindowCommand() {
		var kElement = new KonsenskisteModel.Model(); kElement.id(5);
		this.cxt.controller.commandProcessor.processCommand(new KElementCommands.OpenEditKElementWindowCommand(kElement));
		test.assert(v => this.cxt.viewModel.left.win() instanceof EditKElementWin.Win);
	}
	
	isNotAdminPerDefault() {
		test.assert(v => this.cxt.viewModel.isAdmin() == false);
	}
	
	handleUpdateGeneralContentCommand() {
		var counter = new common.Counter();
		var content = new ContentModel.General();
		content.postId = 5;
		
		this.cxt.communicator.konsenskiste.content.updateGeneral = (model, callbacks) => {
			counter.inc('updateGeneral');
			test.assert(v => v.val(model.postId) == content.postId);
			callbacks.then();
		};
		
		this.cxt.controller.commandProcessor.processCommand(
			new KElementCommands.UpdateGeneralContentCommand(content, { then: () => counter.inc('then') }));
		
		test.assert(v => v.val(counter.get('updateGeneral')) == 1);
		test.assert(v => v.val(counter.get('then')) == 1);
	}
	
	handleUpdateContextCommand() {
		var counter = new common.Counter();
		var content = new ContentModel.Context();
		
		this.cxt.communicator.konsenskiste.content.updateContext = (model, callbacks) => {
			counter.inc('updateContext');
			test.assert(v => v.val(model.postId) == content.postId);
			callbacks.then();
		};
		
		this.cxt.controller.commandProcessor.processCommand(
			new KElementCommands.UpdateContextCommand(content, { then: () => counter.inc('then') }));
		
		test.assert(v => v.val(counter.get('updateContext')) == 1);
		test.assert(v => v.val(counter.get('then')) == 1);
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
		var topic = new tpc.Model();
		topic.title(title);
		return topic;
	}
}