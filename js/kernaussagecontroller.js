define(["require", "exports", 'synchronizers/ksynchronizers', 'contentcontroller', 'contentviewmodel'], function(require, exports, KSync, ContentController, ContentViewModel) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.init(model, viewModel, communicator);
        }
        Controller.prototype.init = function (model, viewModel, communicator) {
            var _this = this;
            viewModel.isActive = ko.observable();
            viewModel.general = ko.observable(new ContentViewModel.General);
            viewModel.context = ko.observable(new ContentViewModel.Context);
            this.viewModel = viewModel;

            this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content).setViewModelChangedHandler(function (general) {
                return _this.viewModel.general(general);
            }).setModelObservable(model.general);

            this.context = new ContentController.Context(model.context(), viewModel.context(), communicator.content);

            viewModel.discussion = ko.observable();
            this.discussionSynchronizer = new KSync.DiscussionSynchronizer(communicator);
            this.discussionSynchronizer.setDiscussableModel(model).setDiscussableViewModel(viewModel).setViewModelObservable(viewModel.discussion).setModelObservable(model.discussion);
        };

        Controller.prototype.setViewModelContext = function (cxt) {
            this.discussionSynchronizer.setViewModelContext(cxt);
        };

        Controller.prototype.dispose = function () {
            this.generalContentSynchronizer.dispose();
            this.context.dispose();
            this.discussionSynchronizer.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
