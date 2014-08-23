var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../contextcontroller', '../contextviewmodel', '../contextmodel'], function(require, exports, unit, test, Controller, ViewModel, Model) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.factory = new Factory();
        }
        Tests.prototype.testText = function () {
            var cxt = this.factory.create();

            cxt.model.text('Klärtext');

            test.assert(function () {
                return cxt.viewModel.text() == 'Klärtext';
            });
        };

        Tests.prototype.testVisibility = function () {
            var cxt = this.factory.create();

            test.assert(function () {
                return cxt.viewModel.isVisible() == false;
            });
        };

        Tests.prototype.testDispose = function () {
            var cxt = this.factory.create();

            cxt.model.text('Klärtext');
            cxt.controller.dispose();
            cxt.model.text('This won\'t be updated to ViewModel');

            test.assert(function () {
                return cxt.viewModel.text() == 'Klärtext';
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function () {
            var model = new Model();
            var viewModel = new ViewModel();
            var controller = new Controller(model, viewModel);

            return { model: model, viewModel: viewModel, controller: controller };
        };
        return Factory;
    })();
});
