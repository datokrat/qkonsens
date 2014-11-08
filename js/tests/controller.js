var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../model', '../viewmodel', '../controller', '../konsenskistemodel', '../topic', '../windows/konsenskiste', 'tests/testcommunicator'], function(require, exports, unit, test, mdl, vm, ctr, koki, tpc, kokiWin, TestCommunicator) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.factory = new Factory();
            this.topicFactory = new TopicFactory();
        }
        Tests.prototype.setUp = function () {
            this.cxt = this.factory.create();
        };

        Tests.prototype.tearDown = function () {
            this.cxt.controller.dispose();
        };

        Tests.prototype.testTopicNavigation = function () {
            this.cxt.model.topicNavigation.appendChild(this.topicFactory.create('root'));

            this.areIdentical(this.cxt.viewModel.topicNavigation.breadcrumb()[0], 'root');
        };

        Tests.prototype.testLeftWinContainer = function () {
            var _this = this;
            test.assert(function () {
                return _this.cxt.viewModel.left != null;
            });
            test.assert(function () {
                return _this.cxt.viewModel.right != null;
            });
            test.assert(function () {
                return _this.cxt.viewModel.center.win() instanceof kokiWin.Win;
            });
        };

        Tests.prototype.testKonsenskiste = function () {
            this.cxt.model.konsenskiste(new koki.Model());
            this.cxt.model.konsenskiste().general().title('Hi!');

            var konsenskisteWindow = this.cxt.viewModel.center.win();
            test.assert(function () {
                return konsenskisteWindow.kkView().general().title() == 'Hi!';
            });
        };

        Tests.prototype.testCommunicatorConnection = function () {
            var oldKoki = new koki.Model;
            oldKoki.id(1);

            this.cxt.model.konsenskiste(oldKoki);

            var newKoki = new koki.Model;
            newKoki.general().title('hi');
            newKoki.general().text('ho');
            this.cxt.communicator.konsenskiste.content.generalContentRetrieved.raise({ general: newKoki.general() });

            var konsenskisteWindow = this.cxt.viewModel.center.win();
            test.assert(function () {
                return konsenskisteWindow.kkView().general().title() == 'hi';
            });
            test.assert(function () {
                return konsenskisteWindow.kkView().general().text() == 'ho';
            });
        };

        Tests.prototype.testLoadKonsenskiste = function () {
            var oldKoki = new koki.Model;
            oldKoki.id(1);
            var newKoki = new koki.Model;
            newKoki.id(1);
            newKoki.general().title('hi');
            this.cxt.model.konsenskiste(oldKoki);

            this.cxt.communicator.konsenskiste.received.raise({ id: 1, konsenskiste: newKoki });

            var konsenskisteWindow = this.cxt.viewModel.center.win();
            test.assert(function () {
                return konsenskisteWindow.kkView().general().title() == 'hi';
            });
        };

        Tests.prototype.testCommunicatorDisposal = function () {
            test.assert(function () {
                return !"not implemented";
            });
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
            var communicator = new TestCommunicator();
            var controller = new ctr.Controller(model, viewModel, communicator);

            return { model: model, viewModel: viewModel, communicator: communicator, controller: controller };
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
