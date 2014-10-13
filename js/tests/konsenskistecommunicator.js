var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', '../common', 'tests/testkonsenskistecommunicator', '../konsenskistemodel', '../konsenskisteviewmodel', '../konsenskistecontroller', 'comment'], function(require, exports, unit, test, common, TestKokiCommunicator, KokiModel, KokiViewModel, KokiController, Comment) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.setUp = function (r) {
            this.com = new TestKokiCommunicator;
            this.mdl = new KokiModel.Model;
            this.vm = new KokiViewModel.ViewModel;
            this.ctr = new KokiController.ControllerImpl(this.mdl, this.vm, this.com);
            r();
        };

        TestClass.prototype.queryKoki = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    var koki1 = new KokiModel.Model;
                    koki1.id(1);
                    koki1.general().title('Title #1');
                    koki1.general().text('Text #1');

                    var koki2 = new KokiModel.Model;
                    koki2.id(2);
                    koki2.general().title('Title #2');
                    koki2.general().text('Text #2');

                    _this.mdl.id(1);

                    _this.com.setTestKoki(koki1);
                    _this.com.setTestKoki(koki2);
                    _this.com.queryKoki(1);
                    _this.com.queryKoki(2);

                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.mdl.general().title() == 'Title #1';
                    });
                    test.assert(function () {
                        return _this.mdl.general().text() == 'Text #1';
                    });
                    r();
                }
            ], r);
        };

        TestClass.prototype.queryComments = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    _this.mdl.id(1);
                    var koki = new KokiModel.Model();
                    koki.id(1);
                    koki.discussion().comments.set([new Comment.Model]);

                    var ctr = 0;
                    _this.com.commentsReceived.subscribe(function (args) {
                        test.assert(function () {
                            return args.comments.length == 1;
                        });
                        ++ctr;
                    });
                    _this.com.setTestKoki(koki);
                    _this.com.queryCommentsOf(1);

                    test.assert(function () {
                        return ctr == 1;
                    });
                    r();
                }
            ], r);
        };

        TestClass.prototype.receiveCommentsFromCommunicator = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    _this.mdl.id(1);
                    _this.com.commentsReceived.raise({ id: 1, comments: [new Comment.Model] });
                    test.assert(function () {
                        return _this.mdl.discussion().comments.get().length == 1;
                    });
                    r();
                }
            ], r);
        };

        TestClass.prototype.communicator = function (cxt, r) {
            var communicator = new TestKokiCommunicator();
            communicator.commentsReceived.subscribe(function (args) {
                return test.assert(function () {
                    return args.comments.length == 1;
                });
            });

            var koki = new KokiModel.Model();
            koki.id(1);
            koki.discussion().comments.set([new Comment.Model]);
            communicator.setTestKoki(koki);
            communicator.queryCommentsOf(1);

            r();
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
