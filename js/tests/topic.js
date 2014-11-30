var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../topic'], function(require, exports, unit, test, Topic) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.properties = function () {
            var model = new Topic.Model();
            var viewModel = new Topic.ViewModel();
            var controller = new Topic.ModelViewModelController(model, viewModel);

            model.title('Parent Title');
            model.text('Parent Text');

            test.assert(function () {
                return viewModel.caption() == 'Parent Title';
            });
            test.assert(function () {
                return viewModel.description() == 'Parent Text';
            });

            viewModel.click.raise();
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
