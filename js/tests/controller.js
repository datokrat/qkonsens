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
        Tests.prototype.testTopicNavigation = function () {
            var cxt = this.factory.create();

            cxt.model.topicNavigation.appendChild(this.topicFactory.create('root'));

            this.areIdentical(cxt.viewModel.topicNavigation.breadcrumb()[0], 'root');
        };

        Tests.prototype.testLeftWinContainer = function () {
            var cxt = this.factory.create();

            test.assert(function () {
                return cxt.viewModel.left != null;
            });
            test.assert(function () {
                return cxt.viewModel.right != null;
            });
            test.assert(function () {
                return cxt.viewModel.center.win() instanceof kokiWin.Win;
            });
        };

        Tests.prototype.testKonsenskiste = function () {
            var cxt = this.factory.create();

            cxt.model.konsenskiste(new koki.Model());
            cxt.model.konsenskiste().content().title('Hi!');

            var konsenskisteWindow = cxt.viewModel.center.win();
            test.assert(function () {
                return konsenskisteWindow.kkView().content().title() == 'Hi!';
            });
        };

        Tests.prototype.testCommunicatorConnection = function () {
            var cxt = this.factory.create();

            var oldKoki = new koki.Model;
            oldKoki.id = 1;

            cxt.model.konsenskiste(oldKoki);

            var newKoki = new koki.Model;
            newKoki.content().title('hi');
            newKoki.content().text('ho');
            cxt.communicator.konsenskiste.content.retrieved.raise({ id: 1, content: newKoki.content() });

            var konsenskisteWindow = cxt.viewModel.center.win();
            test.assert(function () {
                return konsenskisteWindow.kkView().content().title() == 'hi';
            });
            test.assert(function () {
                return konsenskisteWindow.kkView().content().text() == 'ho';
            });
        };

        Tests.prototype.testLoadKonsenskiste = function () {
            var cxt = this.factory.create();

            var oldKoki = new koki.Model;
            oldKoki.id = 1;
            var newKoki = new koki.Model;
            newKoki.id = 1;
            newKoki.content().title('hi');
            cxt.model.konsenskiste(oldKoki);

            cxt.communicator.konsenskiste.received.raise({ id: 1, konsenskiste: newKoki });

            var konsenskisteWindow = cxt.viewModel.center.win();
            test.assert(function () {
                return konsenskisteWindow.kkView().content().title() == 'hi';
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
