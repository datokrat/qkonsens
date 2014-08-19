import unit = require('tests/tsunit')

import mdl = require('../model')
import vm = require('../viewmodel')
import ctr = require('../controller')

import tpc = require('../topic')

export class Tests extends unit.TestClass {
	private factory = new Factory();
	private topicFactory = new TopicFactory();
	
	testTopicNavigation() {
		var cxt = this.factory.create();
		
		cxt.model.topicNavigation.appendChild( this.topicFactory.create('root') );
		
		this.areIdentical( cxt.viewModel.topicNavigation.breadcrumb()[0], 'root' );
	}
}

class Factory {
	public create() {
		var model: mdl.Model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		return { model: model, viewModel: viewModel, controller: controller };
	}
}

class TopicFactory {
	public create(title: string) {
		var topic = new tpc.Topic();
		topic.title(title);
		return topic;
	}
}