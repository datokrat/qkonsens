var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../frame', '../command', '../topiclogic', '../topicnavigationmodel', 'tests/testtopiccommunicator', '../windows'], function(require, exports, unit, test, common, frame, Commands, TopicLogic, TopicNavigationModel, TopicCommunicator, Windows) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.setUp = function () {
            this.counter = new common.Counter();
        };

        Tests.prototype.isRootTopicSelected = function () {
            var resources = ResourceInitializer.createResources();
            var topicLogic = new TopicLogic.Controller(resources);

            test.assert(function (v) {
                return resources.topicNavigationModel.selectedTopic().id.root == true;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var ResourceInitializer = (function () {
        function ResourceInitializer() {
        }
        ResourceInitializer.createResources = function () {
            var ret = new TopicLogic.Resources();
            ret.topicNavigationModel = new TopicNavigationModel.ModelImpl();
            ret.topicCommunicator = new TopicCommunicator.Stub();
            ret.windowViewModel = ResourceInitializer.createWindowViewModel();
            ret.commandProcessor = new Commands.CommandProcessor();
            return ret;
        };

        ResourceInitializer.createWindowViewModel = function () {
            return new Windows.WindowViewModel({
                center: ResourceInitializer.createWinContainer(),
                left: ResourceInitializer.createWinContainer(),
                right: ResourceInitializer.createWinContainer()
            });
        };

        ResourceInitializer.createWinContainer = function () {
            return new frame.WinContainer(new frame.Win('', null));
        };
        return ResourceInitializer;
    })();

    var Mocks = (function () {
        function Mocks() {
        }
        Mocks.counter = function (counter, key) {
            return function () {
                return counter.inc(key);
            };
        };
        return Mocks;
    })();
});
