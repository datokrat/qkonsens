var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../kernaussagemodel', '../kernaussageviewmodel', '../kernaussagecontroller'], function(require, exports, unit, test, mdl, vm, ctr) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.modelFactory = new ModelFactory();
        }
        Tests.prototype.test = function () {
            var model = this.modelFactory.create('Begriff Basisdemokratie');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

            test.assert(function () {
                return viewModel.content.title() == 'Begriff Basisdemokratie';
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var ModelFactory = (function () {
        function ModelFactory() {
        }
        ModelFactory.prototype.create = function (title) {
            var kernaussage = new mdl.Model();
            kernaussage.content.title(title);
            return kernaussage;
        };
        return ModelFactory;
    })();
});
