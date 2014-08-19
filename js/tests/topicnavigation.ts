import unit = require('tests/tsunit')
import ctr = require('../topicnavigationcontroller')
import mdl = require('../topicnavigationmodel')
import vm = require('../topicnavigationviewmodel')
import tpc = require('../topic')

export class Tests extends unit.TestClass {
	private topicFactory = new TopicFactory();

	testBreadcrumbMapping() {
		var model = new mdl.ModelImpl();
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		model.appendChild( this.topicFactory.create('root') );
		
		this.areIdentical(viewModel.breadcrumb()[0], 'root');
	}
}


class TopicFactory {
	public create(title: string) {
		var topic = new tpc.Topic();
		topic.title(title);
		return topic;
	}
}