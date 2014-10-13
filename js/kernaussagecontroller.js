define(["require", "exports", 'synchronizers/ksynchronizers', 'contentviewmodel'], function(require, exports, KSync, ContentViewModel) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.init(model, viewModel, communicator);
        }
        Controller.prototype.init = function (model, viewModel, communicator) {
            var _this = this;
            viewModel.isActive = ko.observable();
            this.viewModel = viewModel;

            viewModel.context = ko.observable(new ContentViewModel.Context);
            this.contextSynchronizer = new KSync.ContextSynchronizer(communicator.content).setViewModelChangedHandler(function (context) {
                return _this.viewModel.context(context);
            }).setModelObservable(model.context);

            viewModel.general = ko.observable(new ContentViewModel.General);
            this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content).setViewModelChangedHandler(function (general) {
                return _this.viewModel.general(general);
            }).setModelObservable(model.general);

            viewModel.discussion = ko.observable();
            this.discussionSynchronizer = new KSync.DiscussionSynchronizer(communicator.discussion);
            this.discussionSynchronizer.setDiscussableModel(model).setDiscussableViewModel(viewModel).setViewModelObservable(viewModel.discussion).setModelObservable(model.discussion);

            this.ratingSynchronizer = new KSync.RatingSynchronizer();
            viewModel.rating = this.ratingSynchronizer.createViewModelObservable();
            this.ratingSynchronizer.setViewModelChangedHandler(function (rating) {
                return _this.viewModel.rating(rating);
            }).setModelObservable(model.rating);
        };

        Controller.prototype.setViewModelContext = function (cxt) {
            this.discussionSynchronizer.setViewModelContext(cxt);
        };

        Controller.prototype.dispose = function () {
            this.generalContentSynchronizer.dispose();
            this.contextSynchronizer.dispose();
            this.discussionSynchronizer.dispose();
            this.ratingSynchronizer.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
