define(["require", "exports", 'observable', 'comment', 'synchronizers/comment', 'windows'], function (require, exports, Obs, Comment, CommentSynchronizer, Windows) {
    var Model = (function () {
        function Model() {
            this.comments = new Obs.ObservableArrayExtender(ko.observableArray());
            this.commentsLoaded = ko.observable();
            this.commentsLoading = ko.observable();
            this.error = ko.observable();
        }
        return Model;
    })();
    exports.Model = Model;
    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
    var Controller = (function () {
        function Controller(model, viewModel, args) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;
            this.args = args;
            this.onCommentsReceived = function (args) {
                if (_this.discussableModel && _this.discussableModel.id() == args.id) {
                    _this.model.comments.set(args.comments);
                    _this.model.commentsLoading(false);
                    _this.model.commentsLoaded(true);
                }
                else if (!_this.discussableModel)
                    throw new Error('this.discussableModel is null/undefined');
            };
            this.onCommentsReceiptError = function (args) {
                if (_this.discussableModel && _this.discussableModel.id() == args.discussableId) {
                    _this.model.error(args.message);
                    _this.model.commentsLoading(false);
                    _this.model.commentsLoaded(false);
                }
            };
            this.discussionClick = function () {
                if (_this.discussableModel && !_this.model.commentsLoading() /*&& !this.model.commentsLoaded()*/) {
                    _this.model.commentsLoading(true);
                    _this.args.communicator.queryCommentsOf(_this.discussableModel.id());
                }
                if (!_this.discussableModel)
                    _this.model.error('DiscussionController.discussableModel is not defined');
                _this.args.commandProcessor.processCommand(new Windows.OpenDiscussionWindowCommand(_this.discussableViewModel));
            };
            this.communicatorSubscriptions = [];
            this.viewModel.comments = ko.observableArray();
            this.viewModel.discussionClick = this.discussionClick;
            this.viewModel.commentsLoading = this.model.commentsLoading;
            this.viewModel.commentsLoaded = this.model.commentsLoaded;
            this.viewModel.error = this.model.error;
            this.viewModel.newCommentDisabled = ko.observable(false);
            this.viewModel.newCommentText = ko.observable();
            this.viewModel.submitCommentClick = function () {
                var comment = new Comment.Model();
                comment.content().text(_this.viewModel.newCommentText());
                _this.viewModel.newCommentText('');
                _this.viewModel.newCommentDisabled(true);
                args.communicator.appendComment(_this.discussableModel.id(), comment);
            };
            this.model.removeComment = function (comment) {
                _this.args.communicator.removeComment({ discussableId: _this.discussableModel.id(), commentId: comment.id });
            };
            this.commentSynchronizer = new CommentSynchronizer(this.args.communicator)
                .setViewModelObservable(this.viewModel.comments)
                .setModelObservable(this.model.comments);
            this.commentSynchronizer.itemCreated.subscribe(function (args) {
                args.controller.setCommentableModel(_this.model);
            });
            this.communicatorSubscriptions = [
                this.args.communicator.commentsReceived.subscribe(this.onCommentsReceived),
                this.args.communicator.commentsReceiptError.subscribe(this.onCommentsReceiptError),
                this.args.communicator.commentAppended.subscribe(this.onCommentAppended.bind(this)),
                this.args.communicator.commentAppendingError.subscribe(this.onCommentAppendingError.bind(this)),
                this.args.communicator.commentRemoved.subscribe(this.onCommentRemoved.bind(this)),
                this.args.communicator.commentRemovalError.subscribe(this.onCommentRemovalError.bind(this)),
            ];
        }
        Controller.prototype.onCommentRemoved = function (args) {
            if (args.discussableId == this.discussableModel.id()) {
                this.model.comments.removeByPredicate(function (c) { return c.id == args.commentId; });
            }
        };
        Controller.prototype.onCommentRemovalError = function (args) {
            if (args.discussableId == this.discussableModel.id()) {
                console.error('comment[' + args.commentId + '] could not be removed');
            }
        };
        Controller.prototype.onCommentAppended = function (args) {
            if (args.discussableId == this.discussableModel.id()) {
                this.args.communicator.queryCommentsOf(this.discussableModel.id());
                this.viewModel.newCommentDisabled(false);
            }
        };
        Controller.prototype.onCommentAppendingError = function (args) {
            if (args.discussableId == this.discussableModel.id()) {
                alert('Beitrag konnte nicht erstellt werden. Bitte lade die Seite neu!');
            }
        };
        Controller.prototype.setDiscussableModel = function (discussableModel) {
            this.discussableModel = discussableModel;
            return this;
        };
        Controller.prototype.setDiscussableViewModel = function (discussableViewModel) {
            this.discussableViewModel = discussableViewModel;
            return this;
        };
        Controller.prototype.setViewModelContext = function (cxt) {
            this.viewModelContext = cxt;
            return this;
        };
        Controller.prototype.dispose = function () {
            this.commentSynchronizer.dispose();
            this.communicatorSubscriptions.forEach(function (s) { return s.dispose(); });
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
