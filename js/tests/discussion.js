var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../discussion', 'tests/testdiscussioncommunicator', '../comment'], function(require, exports, unit, test, Discussion, DiscussionCommunicator, Comment) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.setUp = function () {
            this.model = new Discussion.Model();
            this.viewModel = new Discussion.ViewModel();
            this.communicator = new DiscussionCommunicator();
            this.controller = new Discussion.Controller(this.model, this.viewModel, this.communicator);

            this.discussable = { id: ko.observable(2), discussion: ko.observable() };
            this.discussable.discussion(new Discussion.Model);
            this.discussable.discussion().comments.set([new Comment.Model]);

            this.controller.setDiscussableModel(this.discussable);
        };

        TestClass.prototype.tearDown = function () {
            this.controller.dispose();
        };

        TestClass.prototype.queryComments = function () {
            var ctr = 0;
            this.communicator.setTestDiscussable(this.discussable);
            this.communicator.commentsReceived.subscribe(function (args) {
                test.assert(function () {
                    return args.id == 2;
                });
                test.assert(function () {
                    return args.comments.length == 1;
                });
                test.assert(function () {
                    return ctr == 0;
                });
                ++ctr;
            });

            this.communicator.queryCommentsOf(2);

            test.assert(function () {
                return ctr == 1;
            });
        };

        TestClass.prototype.queryCommentsOfNonExistantId = function () {
            var errorCtr = 0;
            var receivedCtr = 0;
            this.communicator.commentsReceived.subscribe(function () {
                return ++receivedCtr;
            });
            this.communicator.commentsReceiptError.subscribe(function () {
                return ++errorCtr;
            });

            this.communicator.queryCommentsOf(3);

            test.assert(function () {
                return errorCtr == 1;
            });
            test.assert(function () {
                return receivedCtr == 0;
            });
        };

        TestClass.prototype.receiveCommentsFromCommunicator = function () {
            var _this = this;
            this.communicator.commentsReceived.raise({ id: 2, comments: this.discussable.discussion().comments.get() });

            test.assert(function () {
                return _this.model.comments.get().length == 1;
            });
        };

        TestClass.prototype.appendComment = function () {
            var comment = new Comment.Model();
            var successCtr = 0, errorCtr = 0, receiptCtr = 0;

            this.communicator.setTestDiscussable({ id: ko.observable(2), discussion: ko.observable(new Discussion.Model()) });
            this.communicator.commentAppended.subscribe(function (args) {
                return ++successCtr;
            });
            this.communicator.commentAppendingError.subscribe(function (args) {
                return ++errorCtr;
            });
            this.communicator.appendComment(2, comment);

            test.assert(function () {
                return successCtr == 1;
            });
            test.assert(function () {
                return errorCtr == 0;
            });

            this.communicator.commentsReceived.subscribe(function (args) {
                ++receiptCtr;
                test.assert(function () {
                    return args.comments.length == 1;
                });
            });
            this.communicator.queryCommentsOf(2);

            test.assert(function () {
                return receiptCtr == 1;
            });
        };

        TestClass.prototype.removeComment = function () {
            var comment = new Comment.Model();
            var serverDiscussable = { id: ko.observable(2), discussion: ko.observable(new Discussion.Model()) };
            serverDiscussable.discussion().comments.push(new Comment.Model);
            serverDiscussable.discussion().comments.get()[0].id = 10;

            var successCtr = 0, errorCtr = 0, receiptCtr = 0;
            this.communicator.setTestDiscussable(serverDiscussable);
            this.communicator.commentRemoved.subscribe(function (args) {
                return ++successCtr;
            });
            this.communicator.commentRemovalError.subscribe(function (args) {
                return ++errorCtr;
            });

            this.communicator.removeComment({ discussableId: 2, commentId: 10 });

            test.assert(function () {
                return successCtr == 1;
            });
            test.assert(function () {
                return errorCtr == 0;
            });
            test.assert(function () {
                return serverDiscussable.discussion().comments.get().length == 0;
            });
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
