var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../model', '../viewmodel', '../controller', '../konsenskistemodel', '../topic', 'windows/konsenskiste', 'windows/newkk', 'windows/editkelement', 'windows/discussion', '../konsenskistemodel', '../contentmodel', '../discussion', '../kelementcommands', '../communicator', 'tests/testcommunicator', '../kokilogic'], function(require, exports, unit, test, common, mdl, vm, ctr, koki, tpc, kokiWin, NewKkWin, EditKElementWin, DiscussionWin, KonsenskisteModel, ContentModel, Discussion, KElementCommands, Communicator, TestCommunicator, KokiLogic) {
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
            var konsenskiste = new koki.Model();
            konsenskiste.general().title('Hi!');
            this.cxt.controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(konsenskiste));

            var konsenskisteWindow = this.cxt.viewModel.center.win();
            test.assert(function () {
                return konsenskisteWindow.kkView().general().title() == 'Hi!';
            });
        };

        Tests.prototype.testCommunicatorConnection = function () {
            var oldKoki = new koki.Model;
            oldKoki.id(1);

            //this.cxt.model.konsenskiste(oldKoki);
            this.cxt.controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(oldKoki));

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
            this.cxt.controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(oldKoki));

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

        Tests.prototype.loginAfterChangingAccount = function () {
            var counter = new common.Counter();
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var communicator = new TestCommunicator();
            communicator.commandProcessor.chain.insertAtBeginning(function (cmd) {
                if (cmd instanceof Communicator.LoginCommand)
                    counter.inc('login command');
                return true;
            });
            var controller = new ctr.Controller(model, viewModel, communicator);
            communicator.commandProcessor.chain.insertAtBeginning(function (cmd) {
                test.assert(function (v) {
                    return v.val(cmd.userName) == 'TheUnnamed';
                });
                return false;
            });

            test.assert(function (v) {
                return v.val(counter.get('login command')) == 1;
            });

            model.account(new mdl.Account({ userName: 'TheUnnamed' }));

            test.assert(function (v) {
                return v.val(counter.get('login command')) == 2;
            });
        };

        Tests.prototype.updateViewModelAfterChangingAccount = function () {
            var _this = this;
            this.cxt.model.account(new mdl.Account({ userName: 'TheUnnamed' }));

            test.assert(function (v) {
                return _this.cxt.viewModel.userName() == 'TheUnnamed';
            });
        };

        Tests.prototype.updateAccountModelAfterChangingAccountViewModel = function () {
            var _this = this;
            var counter = new common.Counter();
            this.cxt.model.account.subscribe(function () {
                return counter.inc('account changed');
            });

            this.cxt.viewModel.userName('TheUnnamed');

            test.assert(function (v) {
                return v.val(_this.cxt.model.account().userName) == 'TheUnnamed';
            });
            test.assert(function (v) {
                return v.val(counter.get('account changed')) == 1;
            });
        };

        Tests.prototype.processCreateNewKokiCommand = function () {
            var counter = new common.Counter();
            this.cxt.communicator.konsenskiste.create = function (koki, parentTopicId, then) {
                counter.inc('communicator.create');
                then(2);
            };
            this.cxt.controller.commandProcessor.processCommand(new ctr.CreateNewKokiCommand({ text: "", title: "" }, { id: 1 }, function (id) {
                test.assert(function (v) {
                    return v.val(id) == 2;
                });
                counter.inc('then');
            }));
            test.assert(function (v) {
                return v.val(counter.get('then')) == 1;
            });
            test.assert(function (v) {
                return v.val(counter.get('communicator.create')) == 1;
            });
        };

        Tests.prototype.processOpenNewKkWindowCommand = function () {
            var _this = this;
            var topic = new tpc.Model();
            topic.title('Parent Topic apgr');
            this.cxt.controller.commandProcessor.processCommand(new ctr.OpenNewKokiWindowCommand(topic));
            test.assert(function (v) {
                return _this.cxt.viewModel.left.win() instanceof NewKkWin.Win;
            });
            test.assert(function (v) {
                return _this.cxt.viewModel.left.win().parentName() == 'Parent Topic apgr';
            });
        };

        Tests.prototype.processOpenDiscussionWindowCommand = function () {
            var _this = this;
            var discussableViewModel = {
                discussion: ko.observable(new Discussion.ViewModel)
            };
            this.cxt.controller.commandProcessor.processCommand(new ctr.OpenDiscussionWindowCommand(discussableViewModel));
            test.assert(function (v) {
                return _this.cxt.viewModel.left.win() instanceof DiscussionWin.Win;
            });
        };

        Tests.prototype.processOpenEditKElementWindowCommand = function () {
            var _this = this;
            var kElement = new KonsenskisteModel.Model();
            kElement.id(5);
            this.cxt.controller.commandProcessor.processCommand(new KElementCommands.OpenEditKElementWindowCommand(kElement));
            test.assert(function (v) {
                return _this.cxt.viewModel.left.win() instanceof EditKElementWin.Win;
            });
        };

        Tests.prototype.isNotAdminPerDefault = function () {
            var _this = this;
            test.assert(function (v) {
                return _this.cxt.viewModel.isAdmin() == false;
            });
        };

        Tests.prototype.handleUpdateGeneralContentCommand = function () {
            var counter = new common.Counter();
            var content = new ContentModel.General();
            content.postId = 5;

            this.cxt.communicator.konsenskiste.content.updateGeneral = function (model, callbacks) {
                counter.inc('updateGeneral');
                test.assert(function (v) {
                    return v.val(model.postId) == content.postId;
                });
                callbacks.then();
            };

            this.cxt.controller.commandProcessor.processCommand(new KElementCommands.UpdateGeneralContentCommand(content, { then: function () {
                    return counter.inc('then');
                } }));

            test.assert(function (v) {
                return v.val(counter.get('updateGeneral')) == 1;
            });
            test.assert(function (v) {
                return v.val(counter.get('then')) == 1;
            });
        };

        Tests.prototype.handleUpdateContextCommand = function () {
            var counter = new common.Counter();
            var content = new ContentModel.Context();

            this.cxt.communicator.konsenskiste.content.updateContext = function (model, callbacks) {
                counter.inc('updateContext');
                test.assert(function (v) {
                    return v.val(model.postId) == content.postId;
                });
                callbacks.then();
            };

            this.cxt.controller.commandProcessor.processCommand(new KElementCommands.UpdateContextCommand(content, { then: function () {
                    return counter.inc('then');
                } }));

            test.assert(function (v) {
                return v.val(counter.get('updateContext')) == 1;
            });
            test.assert(function (v) {
                return v.val(counter.get('then')) == 1;
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
            var topic = new tpc.Model();
            topic.title(title);
            return topic;
        };
        return TopicFactory;
    })();
});
