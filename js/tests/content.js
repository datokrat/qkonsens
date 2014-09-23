var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../factories/contentmodel', '../contentviewmodel', '../contentcontroller', 'tests/testcontentcommunicator'], function(require, exports, unit, test, ModelFactory, vm, ctr, ContentCommunicator) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.modelFactory = new ModelFactory;
        }
        Tests.prototype.test = function () {
            var model = this.modelFactory.create('Text', 'Title');
            var viewModel = new vm.ViewModel();
            var communicator = new ContentCommunicator();
            var controller = new ctr.Controller(model, viewModel, communicator);

            test.assert(function () {
                return viewModel.title() == 'Title';
            });
            test.assert(function () {
                return viewModel.text() == 'Text';
            });
        };

        Tests.prototype.testDispose = function () {
            var model = this.modelFactory.create('Text', 'Title');
            var viewModel = new vm.ViewModel();
            var communicator = new ContentCommunicator();
            var controller = new ctr.Controller(model, viewModel, communicator);

            controller.dispose();
            model.title('New Title');
            model.text('New Text');

            test.assert(function () {
                return viewModel.title() == 'Title';
            });
            test.assert(function () {
                return viewModel.text() == 'Text';
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var TestsWithContext = (function (_super) {
        __extends(TestsWithContext, _super);
        function TestsWithContext() {
            _super.apply(this, arguments);
        }
        TestsWithContext.prototype.testModelWithContext = function () {
            var model = this.modelFactory.createWithContext('Text', 'Title', 'Context');
            var viewModel = new vm.WithContext();
            var communicator = new ContentCommunicator();
            var controller = new ctr.WithContext(model, viewModel, communicator);

            test.assert(function () {
                return viewModel.context().text() == 'Context';
            });
        };

        TestsWithContext.prototype.testDisposeWithContext = function () {
            var model = this.modelFactory.createWithContext('Text', 'Title', 'Context');
            var viewModel = new vm.WithContext();
            var communicator = new ContentCommunicator();
            var controller = new ctr.WithContext(model, viewModel, communicator);

            controller.dispose();
            model.context().text('New Context');

            test.assert(function () {
                return viewModel.context().text() == 'Context';
            });
        };
        return TestsWithContext;
    })(Tests);
    exports.TestsWithContext = TestsWithContext;
});
