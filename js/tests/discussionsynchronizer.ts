import unit = require('tests/tsunit');
import test = require('tests/test');

import Commands = require('../command');
import Discussion = require('../discussion');
import DiscussionCommunicator = require('tests/testdiscussioncommunicator');
import KSync = require('synchronizers/ksynchronizers');
import ViewModelContext = require('../viewmodelcontext');
import Factories = require('factories/constructorbased');

interface MockHandle {
	unmock(): void;
}

class Mocker {
	public static mock(parentClass: any, name: string, mock: (old: () => any, arguments: IArguments) => any): MockHandle {
		var old = parentClass.prototype[name];
		parentClass.prototype[name] = function() { var a = [old]; a = a.concat(arguments); mock.apply(this, a); };
		
		return { unmock: () => parentClass.prototype[name] = old };
	}
}

class TestClass extends unit.TestClass {
	private sync: KSync.DiscussionSynchronizer;
	
	setUp() {
		this.sync = new KSync.DiscussionSynchronizer({ communicator: new DiscussionCommunicator, commandProcessor: null });
	}
	
	setViewModelContext() {
		var ctr = 0;
		Mocker.mock(Discussion.Controller, 'setViewModelContext', function(old: () => any, args: IArguments) {
			++ctr;
			old.apply(this, args);
		});
		
		var model = new Discussion.Model();
		this.sync.setViewModelFactory(new Factories.Factory(Discussion.ViewModel));
		this.sync.setControllerFactory(new Factories.ControllerFactoryEx<Discussion.Model, Discussion.ViewModel, {communicator: DiscussionCommunicator; commandProcessor: Commands.CommandProcessor}, Discussion.Controller>(Discussion.Controller, {communicator: new DiscussionCommunicator, commandProcessor: null}));
		this.sync.setModelObservable(ko.observable<Discussion.Model>(model));
		this.sync.setViewModelObservable(ko.observable<Discussion.ViewModel>());
		this.sync.setViewModelContext(new ViewModelContext(null, null, null));
		test.assert( () => ctr == 1 );
	}
}

export = TestClass;