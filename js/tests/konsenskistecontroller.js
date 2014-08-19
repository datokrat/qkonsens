var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', 'factories/konsenskistemodel', 'factories/kernaussagemodel', '../konsenskisteviewmodel', '../konsenskistecontroller'], function(require, exports, unit, test, kkModelFty, kaModelFty, vm, ctr) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.kkModelFactory = new kkModelFty.Factory();
            this.kaModelFactory = new kaModelFty.Factory();
        }
        Tests.prototype.testChildKas = function () {
            var model = this.kkModelFactory.create('Basisdemokratie (Konzept)');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

            model.appendKa(this.kaModelFactory.create('Begriff Basisdemokratie'));

            test.assert(function () {
                return viewModel.childKas()[0].title() == 'Begriff Basisdemokratie';
            });
            test.assert(function () {
                return viewModel.childKas().length == 1;
            });
            test.assert(function () {
                return !viewModel.childKas()[0].isActive();
            });
        };

        Tests.prototype.testRemoveChildKa = function () {
            var model = this.kkModelFactory.create('Basisdemokratie (Konzept)');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);
            var ka = this.kaModelFactory.create('Begriff Basisdemokratie');

            model.appendKa(this.kaModelFactory.create('Begriff Basisdemokratie'));
            model.removeKa(this.kaModelFactory.create('Begriff Basisdemokratie'));

            test.assert(function () {
                return viewModel.childKas().length == 0;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
