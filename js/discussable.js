define(["require", "exports", 'synchronizers/comment'], function(require, exports, CommentSynchronizer) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;
            this.discussionClick = function () {
                if (_this.viewModelContext) {
                    _this.communicator.queryCommentsOf(_this.model.id);
                    _this.viewModelContext.discussionWindow.discussable(_this.viewModel);
                    _this.viewModelContext.setLeftWindow(_this.viewModelContext.discussionWindow);
                }
            };
            this.viewModel.comments = ko.observableArray();
            this.viewModel.discussionClick = this.discussionClick;

            this.commentSynchronizer = new CommentSynchronizer(this.communicator.content).setViewModelObservable(this.viewModel.comments).setModelObservable(this.model.comments);
        }
        Controller.prototype.setViewModelContext = function (cxt) {
            this.viewModelContext = cxt;
        };

        Controller.prototype.dispose = function () {
            this.commentSynchronizer.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
