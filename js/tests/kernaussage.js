var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../kernaussagemodel', '../kernaussageviewmodel', '../kernaussagecontroller', 'tests/testkernaussagecommunicator'], function(require, exports, unit, test, Model, ViewModel, Controller, KernaussageCommunicator) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.modelFactory = new ModelFactory();
        }
        Tests.prototype.test = function () {
            var model = this.modelFactory.create('Begriff Basisdemokratie', 'Basisdemokratie ist Demokratie, die aus der Basis kommt', 'Baduum-Disch!');
            var viewModel = new ViewModel.ViewModel();
            var communicator = new KernaussageCommunicator();
            var controller = new Controller.Controller(model, viewModel, { communicator: communicator, commandProcessor: null });

            test.assert(function () {
                return viewModel.general().title() == 'Begriff Basisdemokratie';
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var ModelFactory = (function () {
        function ModelFactory() {
        }
        ModelFactory.prototype.create = function (title, text, context) {
            var kernaussage = new Model.Model();
            kernaussage.general().title(title);
            kernaussage.general().text(text);
            kernaussage.context().text(context);
            return kernaussage;
        };
        return ModelFactory;
    })();
});
