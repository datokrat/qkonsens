var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../frame', '../command', '../controller', '../konsenskistemodel', 'tests/testkonsenskistecommunicator', 'windows/konsenskiste', '../windowviewmodel', '../kokilogic', '../statelogic'], function(require, exports, unit, test, common, frame, Commands, Controller, KonsenskisteModel, KonsenskisteCommunicator, KonsenskisteWin, WindowViewModel, KokiLogic, StateLogic) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.setUp = function () {
            this.counter = new common.Counter();
        };

        Tests.prototype.windowPlacement = function () {
            var resources = ResourceInitializer.createResources();
            var kokiLogic = new KokiLogic.Controller(resources);

            test.assert(function (v) {
                return resources.windowViewModel.getWindowOfFrame(0 /* Center */) instanceof KonsenskisteWin.Win;
            });
        };

        Tests.prototype.processSelectAndLoadKokiCommand = function () {
            var _this = this;
            var resources = ResourceInitializer.createResources();
            resources.konsenskisteCommunicator.query = function (id) {
                _this.counter.inc('query');
                return new KonsenskisteModel.Model();
            };
            var kokiLogic = new KokiLogic.Controller(resources);

            kokiLogic.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(new KonsenskisteModel.Model));

            test.assert(function (v) {
                return v.val(_this.counter.get('query')) == 1;
            });
        };

        Tests.prototype.processSetKokiCommand = function () {
            var _this = this;
            var resources = ResourceInitializer.createResources();
            resources.konsenskisteWinControllerFactory = { create: function () {
                    var ret = new KokiWinControllerStub();
                    ret.setKonsenskisteModel = function (model) {
                        return _this.counter.inc('setKonsenskisteModel');
                    };
                    return ret;
                } };
            var kokiLogic = new KokiLogic.Controller(resources);

            kokiLogic.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(new KonsenskisteModel.Model));

            test.assert(function (v) {
                return v.val(_this.counter.get('setKonsenskisteModel')) == 1;
            });
        };

        Tests.prototype.processCreateNewKokiCommand = function () {
            var _this = this;
            var resources = ResourceInitializer.createResources();
            resources.konsenskisteCommunicator.create = function (koki, topicId, then) {
                _this.counter.inc('communicator.create');
                then(3);
            };
            var kokiLogic = new KokiLogic.Controller(resources);

            kokiLogic.commandProcessor.processCommand(new KokiLogic.CreateNewKokiCommand(new KonsenskisteModel.Model, 3, function () {
                return _this.counter.inc('then');
            }));

            test.assert(function (v) {
                return v.val(_this.counter.get('communicator.create')) == 1;
            });
            test.assert(function (v) {
                return v.val(_this.counter.get('then')) == 1;
            });
        };

        Tests.prototype.processHandleChangedAccountCommand = function () {
            var _this = this;
            var resources = ResourceInitializer.createResources();
            var kokiLogic = new KokiLogic.Controller(resources);

            resources.konsenskisteCommunicator.query = function () {
                _this.counter.inc('query');
                return new KonsenskisteModel.Model();
            };

            resources.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(new KonsenskisteModel.Model()));
            resources.commandProcessor.processCommand(new Controller.HandleChangedAccountCommand());

            test.assert(function (v) {
                return v.val(_this.counter.get('query')) == 1;
            });
        };

        Tests.prototype.sendHandleChangedKokiWinStateCommand = function () {
            var _this = this;
            var resources = ResourceInitializer.createResources();
            var kokiLogic = new KokiLogic.Controller(resources);

            resources.commandProcessor.chain.append(function (cmd) {
                _this.counter.inc('cmd');
                test.assert(function (v) {
                    return cmd instanceof KokiLogic.HandleChangedKokiWinStateCommand;
                });
                return true;
            });

            var koki = new KonsenskisteModel.Model();
            koki.id(3);
            kokiLogic.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(koki));

            test.assert(function (v) {
                return v.val(_this.counter.get('cmd')) == 1;
            });
        };

        Tests.prototype.processChangeKokiStateCommand = function () {
            var _this = this;
            var resources = ResourceInitializer.createResources();
            var kokiLogic = new KokiLogic.Controller(resources);

            var state = { kokiId: 19 };
            resources.konsenskisteCommunicator.query = function (id) {
                _this.counter.inc('query');
                return new KonsenskisteModel.Model();
            };
            kokiLogic.commandProcessor.processCommand(new StateLogic.ChangeKokiStateCommand(state));

            test.assert(function (v) {
                return v.val(_this.counter.get('query')) == 1;
            });
        };

        Tests.prototype.passUnknownCommandFromChildToParent = function () {
            var _this = this;
            var resources = ResourceInitializer.createResources();
            var kokiLogic = new KokiLogic.Controller(resources);
            var command = {};

            resources.commandProcessor.chain.append(function (cmd) {
                _this.counter.inc('cmd');
                test.assert(function (v) {
                    return cmd == command;
                });
                return true;
            });

            kokiLogic['internalCommandProcessor'].processCommand(command);

            test.assert(function (v) {
                return v.val(_this.counter.get('cmd')) == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var ResourceInitializer = (function () {
        function ResourceInitializer() {
        }
        ResourceInitializer.createResources = function () {
            var ret = new KokiLogic.Resources();
            ret.windowViewModel = ResourceInitializer.createWindowViewModel();
            ret.konsenskisteCommunicator = new KonsenskisteCommunicator.Stub();
            ret.commandProcessor = new Commands.CommandProcessor();
            return ret;
        };

        ResourceInitializer.createWindowViewModel = function () {
            return new WindowViewModel.Main({
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

    var KokiWinControllerStub = (function () {
        function KokiWinControllerStub() {
        }
        KokiWinControllerStub.prototype.setKonsenskisteModelById = function (id) {
        };
        KokiWinControllerStub.prototype.setKonsenskisteModel = function (model) {
        };
        KokiWinControllerStub.prototype.dispose = function () {
        };
        return KokiWinControllerStub;
    })();
});
