var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', '../model', '../viewmodel', '../controller', '../topic'], function(require, exports, unit, mdl, vm, ctr, tpc) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.factory = new Factory();
            this.topicFactory = new TopicFactory();
        }
        Tests.prototype.testTopicNavigation = function () {
            var cxt = this.factory.create();

            cxt.model.topicNavigation.appendChild(this.topicFactory.create('root'));

            this.areIdentical(cxt.viewModel.topicNavigation.breadcrumb()[0], 'root');
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

            return { model: model, viewModel: viewModel, controller: controller };
        };
        return Factory;
    })();

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
