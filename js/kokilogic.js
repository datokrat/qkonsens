var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'command', 'memory', 'windows/konsenskiste', 'windows/konsenskistecontroller', 'windowviewmodel', 'statelogic', 'accountlogic'], function(require, exports, Commands, Memory, KonsenskisteWin, KonsenskisteWinController, WindowViewModel, StateLogic, AccountLogic) {
    var Controller = (function () {
        function Controller(resources) {
            this.resources = resources;
            this.konsenskisteModel = ko.observable();
            this.disposableContainer = new Memory.DisposableContainer();
            this.initCommandProcessors();
            this.initKonsenskisteModel();
            this.initKonsenskisteWin();
        }
        Controller.prototype.dispose = function () {
            this.konsenskisteWinController.dispose();
            this.disposableContainer.dispose();
        };

        Controller.prototype.initCommandProcessors = function () {
            var _this = this;
            this.commandProcessor = new Commands.CommandProcessor();
            this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof SelectAndLoadKokiCommand)
                    return _this.onSelectAndLoadKokiCommandReceived(cmd);
                if (cmd instanceof SetKokiCommand)
                    return _this.onSetKokiCommandReceived(cmd);
                if (cmd instanceof AccountLogic.HandleChangedAccountCommand)
                    return _this.onHandleChangedAccountCommandReceived(cmd);
                if (cmd instanceof StateLogic.ChangeKokiStateCommand)
                    return _this.onChangeKokiStateCommandReceived(cmd);
            });

            this.internalCommandProcessor = new Commands.CommandProcessor();
            this.internalCommandProcessor.parent = this.resources.commandProcessor;
            this.internalCommandProcessor.chain.append(function (cmd) {
                if (cmd instanceof HandleChangedKokiWinStateCommand)
                    return _this.onHandleChangedKokiWinStateCommandReceived(cmd);
            });

            this.disposableContainer.append(this.resources.commandProcessor.chain.append(function (cmd, mode) {
                return _this.commandProcessor.chain.runOrFlood(cmd, mode);
            }));
        };

        Controller.prototype.initKonsenskisteModel = function () {
            var _this = this;
            this.konsenskisteModel.subscribe(function (kokiModel) {
                return _this.onKonsenskisteModelChanged(kokiModel);
            });
        };

        Controller.prototype.initKonsenskisteWin = function () {
            this.konsenskisteWin = new KonsenskisteWin.Win();
            this.konsenskisteWinController = this.createKonsenskisteWinController();

            this.resources.windowViewModel.fillFrameWithWindow(0 /* Center */, this.konsenskisteWin);
        };

        Controller.prototype.onSelectAndLoadKokiCommandReceived = function (cmd) {
            this.selectAndLoadKoki(cmd.id);
            return true;
        };

        Controller.prototype.onSetKokiCommandReceived = function (cmd) {
            this.setKoki(cmd.model);
            return true;
        };

        Controller.prototype.onHandleChangedAccountCommandReceived = function (cmd) {
            if (this.konsenskisteModel()) {
                this.selectAndLoadKoki(this.konsenskisteModel().id());
            }
            return true;
        };

        Controller.prototype.onHandleChangedKokiWinStateCommandReceived = function (cmd) {
            this.resources.commandProcessor.floodCommand(cmd);
            return true;
        };

        Controller.prototype.onChangeKokiStateCommandReceived = function (cmd) {
            this.selectAndLoadKoki(cmd.state.kokiId);
            return true;
        };

        Controller.prototype.selectAndLoadKoki = function (id) {
            this.setKoki(this.resources.konsenskisteCommunicator.query(id));
        };

        Controller.prototype.setKoki = function (koki) {
            this.konsenskisteModel(koki);
        };

        Controller.prototype.onKonsenskisteModelChanged = function (kokiModel) {
            this.konsenskisteWinController.setKonsenskisteModel(kokiModel);
        };

        Controller.prototype.createKonsenskisteWinController = function () {
            if (this.resources.konsenskisteWinControllerFactory)
                return this.resources.konsenskisteWinControllerFactory.create(this.konsenskisteModel(), this.konsenskisteWin, { communicator: this.resources.konsenskisteCommunicator, commandProcessor: this.internalCommandProcessor });
            else
                return new KonsenskisteWinController.ControllerImpl(this.konsenskisteModel(), this.konsenskisteWin, { communicator: this.resources.konsenskisteCommunicator, commandProcessor: this.internalCommandProcessor });
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var Resources = (function () {
        function Resources() {
        }
        return Resources;
    })();
    exports.Resources = Resources;

    var SelectAndLoadKokiCommand = (function (_super) {
        __extends(SelectAndLoadKokiCommand, _super);
        function SelectAndLoadKokiCommand(id) {
            _super.call(this);
            this.id = id;
        }
        return SelectAndLoadKokiCommand;
    })(Commands.Command);
    exports.SelectAndLoadKokiCommand = SelectAndLoadKokiCommand;

    var SetKokiCommand = (function (_super) {
        __extends(SetKokiCommand, _super);
        function SetKokiCommand(model) {
            _super.call(this);
            this.model = model;
        }
        return SetKokiCommand;
    })(Commands.Command);
    exports.SetKokiCommand = SetKokiCommand;

    var HandleChangedKokiWinStateCommand = (function (_super) {
        __extends(HandleChangedKokiWinStateCommand, _super);
        function HandleChangedKokiWinStateCommand(state) {
            _super.call(this);
            this.state = state;
        }
        return HandleChangedKokiWinStateCommand;
    })(Commands.Command);
    exports.HandleChangedKokiWinStateCommand = HandleChangedKokiWinStateCommand;
});
