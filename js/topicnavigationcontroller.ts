import Model = require('topicnavigationmodel');
import ViewModel = require('topicnavigationviewmodel');

export class Controller {
	constructor(model: Model.Model, viewModel: ViewModel.ViewModel) {
		viewModel.breadcrumb = ko.computed<string[]>(() => model.breadcrumbTopics.get().map(t => t.title()));
	}
}