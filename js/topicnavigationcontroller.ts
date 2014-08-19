export class Controller {
	constructor(model, viewModel) {
		viewModel.breadcrumb = ko.computed<string[]>(() => model.getBreadcrumbTopics().map(t => t.title()));
	}
}