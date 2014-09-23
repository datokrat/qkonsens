var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../factories/contentmodel', '../contentviewmodel', '../contentcontroller', 'tests/testcontentcommunicator'], function(require, exports, unit, test, ModelFactory, vm, ctr, ContentCommunicator) {
    var General = (function (_super) {
        __extends(General, _super);
        function General() {
            _super.apply(this, arguments);
            this.modelFactory = new ModelFactory;
        }
        General.prototype.test = function () {
            var model = this.modelFactory.createGeneralContent('Text', 'Title');
            var viewModel = new vm.General();
            var communicator = new ContentCommunicator();
            var controller = new ctr.General(model, viewModel, communicator);

            test.assert(function () {
                return viewModel.title() == 'Title';
            });
            test.assert(function () {
                return viewModel.text() == 'Text';
            });
        };

        General.prototype.testDispose = function () {
            var model = this.modelFactory.createGeneralContent('Text', 'Title');
            var viewModel = new vm.General();
            var communicator = new ContentCommunicator();
            var controller = new ctr.General(model, viewModel, communicator);

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
        return General;
    })(unit.TestClass);
    exports.General = General;

    var Context = (function () {
        function Context() {
            this.modelFactory = new ModelFactory;
        }
        Context.prototype.testModelWithContext = function () {
            var model = this.modelFactory.createContext('Context');
            var viewModel = new vm.Context();
            var controller = new ctr.Context(model, viewModel);

            test.assert(function () {
                return viewModel.text() == 'Context';
            });
        };

        Context.prototype.testDisposeWithContext = function () {
            var model = this.modelFactory.createContext('Context');
            var viewModel = new vm.Context();
            var controller = new ctr.Context(model, viewModel);

            controller.dispose();
            model.text('New Context');

            test.assert(function () {
                return viewModel.text() == 'Context';
            });
        };
        return Context;
    })();
    exports.Context = Context;
});
