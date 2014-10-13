var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../discussable', 'tests/testdiscussablecommunicator', '../comment'], function(require, exports, unit, test, Discussion, DiscussionCommunicator, Comment) {
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

        TestClass.prototype.receiveCommentsFromCommunicator = function () {
            var _this = this;
            this.communicator.commentsReceived.raise({ id: 2, comments: this.discussable.discussion().comments.get() });

            test.assert(function () {
                return _this.model.comments.get().length == 1;
            });
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
