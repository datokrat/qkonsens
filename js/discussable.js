define(["require", "exports", 'synchronizers/comment'], function(require, exports, CommentSynchronizer) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;
            this.onCommentsReceived = function (args) {
                if (_this.model.id == args.id) {
                    _this.model.comments.set(args.comments);
                    _this.model.commentsLoading(false);
                    _this.model.commentsLoaded(true);
                }
            };
            this.discussionClick = function () {
                if (_this.viewModelContext) {
                    if (!_this.model.commentsLoading() && !_this.model.commentsLoaded()) {
                        _this.model.commentsLoading(true);
                        _this.communicator.queryCommentsOf(_this.model.id);
                    }
                    _this.viewModelContext.discussionWindow.discussable(_this.viewModel);
                    _this.viewModelContext.setLeftWindow(_this.viewModelContext.discussionWindow);
                }
            };
            this.communicatorSubscriptions = [];
            this.viewModel.comments = ko.observableArray();
            this.viewModel.discussionClick = this.discussionClick;

            this.commentSynchronizer = new CommentSynchronizer(this.communicator.content).setViewModelObservable(this.viewModel.comments).setModelObservable(this.model.comments);

            this.communicatorSubscriptions = [
                this.communicator.commentsReceived.subscribe(this.onCommentsReceived)
            ];
        }
        Controller.prototype.setViewModelContext = function (cxt) {
            this.viewModelContext = cxt;
        };

        Controller.prototype.dispose = function () {
            this.commentSynchronizer.dispose();
            this.communicatorSubscriptions.forEach(function (s) {
                return s.undo();
            });
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
