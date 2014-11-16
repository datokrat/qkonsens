import Model = require('topicnavigationmodel');
import ViewModel = require('topicnavigationviewmodel');
import Topic = require('topic');
import TSync = require('synchronizers/tsynchronizers');

export class Controller {
	constructor(model: Model.Model, viewModel: ViewModel.ViewModel) {
		//viewModel.breadcrumb = ko.computed<Topic.ViewModel[]>(() => model.breadcrumbTopics.get().map(t => t.title()));
		viewModel.breadcrumb = ko.observableArray<Topic.ViewModel>();
		this.breadcrumbSync = new TSync.ChildTopicSync()
			.setModelObservable(model.breadcrumbTopics)
			.setViewModelObservable(viewModel.breadcrumb);
	}
	
	private breadcrumbSync: TSync.ChildTopicSync;
}