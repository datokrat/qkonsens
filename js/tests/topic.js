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
            var model = new Topic.ParentModel();
            var viewModel = new Topic.ParentViewModel();
            var controller = new Topic.ParentController(model, viewModel);

            model.properties().title('Parent Title');
            model.properties().text('Parent Text');

            test.assert(function () {
                return viewModel.caption() == 'Parent Title';
            });
            test.assert(function () {
                return viewModel.description() == 'Parent Text';
            });
            test.assert(function () {
                return viewModel.children() != null;
            });

            viewModel.click();
        };

        Tests.prototype.children = function () {
            var model = new Topic.ParentModel();
            var viewModel = new Topic.ParentViewModel();
            var controller = new Topic.ParentController(model, viewModel);

            model.children.push(new Topic.Model);
            model.children.get()[0].title('Child Title');

            test.assert(function () {
                return viewModel.children().length == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
