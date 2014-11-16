define(["require", "exports", 'synchronizers/tsynchronizers'], function(require, exports, TSync) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            //viewModel.breadcrumb = ko.computed<Topic.ViewModel[]>(() => model.breadcrumbTopics.get().map(t => t.title()));
            viewModel.breadcrumb = ko.observableArray();
            this.breadcrumbSync = new TSync.ChildTopicSync().setModelObservable(model.breadcrumbTopics).setViewModelObservable(viewModel.breadcrumb);
        }
        return Controller;
    })();
    exports.Controller = Controller;
});
