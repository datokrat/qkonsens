var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../factories/contentmodel', '../contentviewmodel', '../contentcontroller'], function(require, exports, unit, test, modelFactory, vm, ctr) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.modelFactory = new modelFactory.Factory();
        }
        Tests.prototype.test = function () {
            var model = this.modelFactory.create('Text', 'Title');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

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
});
