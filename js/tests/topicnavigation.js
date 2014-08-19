var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', '../topicnavigationcontroller', '../topicnavigationmodel', '../topicnavigationviewmodel', '../topic'], function(require, exports, unit, ctr, mdl, vm, tpc) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.topicFactory = new TopicFactory();
        }
        Tests.prototype.testBreadcrumbMapping = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

            model.appendChild(this.topicFactory.create('root'));

            this.areIdentical(viewModel.breadcrumb()[0], 'root');
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var TopicFactory = (function () {
        function TopicFactory() {
        }
        TopicFactory.prototype.create = function (title) {
            var topic = new tpc.Topic();
            topic.title(title);
            return topic;
        };
        return TopicFactory;
    })();
});
