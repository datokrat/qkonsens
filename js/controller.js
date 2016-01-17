var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'topicnavigationmodel', 'frame', 'windows/none', 'statelogic', 'topiclogic', 'kokilogic', 'accountlogic', 'account', 'command', 'kelementcommands', 'windows'], function (require, exports, TopicNavigationModel, frame, noneWin, StateLogic, TopicLogic, KokiLogic, AccountLogic, Account, Commands, KElementCommands, Windows) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;
            this.commandProcessor = new Commands.CommandProcessor();
            this.subscriptions = [];
            this.initCommandControl(communicator);
            this.initWindows();
            this.initWindowViewModel();
            this.initWindowLogic();
            this.initKokiLogic();
            this.initTopicLogic();
            this.initAccountLogic();
            this.initStateLogic();
        }
        Controller.prototype.initCommandControl = function (parent) {
            var _this = this;
            this.commandProcessor.parent = parent && parent.commandProcessor;
            this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof CreateNewKokiCommand) {
                    var createKokiCommand = cmd;
                    var topicId = !createKokiCommand.parentTopicId.root && createKokiCommand.parentTopicId.id;
                    _this.communicator.konsenskiste.create(createKokiCommand.data, topicId, function (id) { return createKokiCommand.then(id); });
                    return true;
                }
                if (cmd instanceof KElementCommands.UpdateGeneralContentCommand) {
                    var updateGeneralContentCommand = cmd;
                    _this.communicator.konsenskiste.content.updateGeneral(updateGeneralContentCommand.content, { then: function () {
                            updateGeneralContentCommand.callbacks.then();
                        } });
                    return true;
                }
                if (cmd instanceof KElementCommands.UpdateContextCommand) {
                    var updateContextCommand = cmd;
                    _this.communicator.konsenskiste.content.updateContext(updateContextCommand.content, { then: function () {
                            updateContextCommand.callbacks.then();
                        }, error: function () { } });
                    return true;
                }
                return false;
            });
        };
        Controller.prototype.initWindows = function () {
            this.windows = new Windows.Windows(this.commandProcessor);
            this.viewModel.left = new frame.WinContainer(this.windows.introFrame);
            this.viewModel.right = new frame.WinContainer(new noneWin.Win());
            this.viewModel.center = new frame.WinContainer(new noneWin.Win());
        };
        Controller.prototype.initWindowViewModel = function () {
            this.windowViewModel = new Windows.WindowViewModel({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
        };
        Controller.prototype.initWindowLogic = function () {
            this.windowLogic = new Windows.WindowLogic(this.windowViewModel, this.windows, this.commandProcessor);
        };
        Controller.prototype.initKokiLogic = function () {
            var kokiLogicResources = new KokiLogic.Resources();
            kokiLogicResources.windowViewModel = this.windowViewModel;
            kokiLogicResources.konsenskisteCommunicator = this.communicator.konsenskiste;
            kokiLogicResources.commandProcessor = this.commandProcessor;
            this.kokiLogic = new KokiLogic.Controller(kokiLogicResources);
        };
        Controller.prototype.initTopicLogic = function () {
            var topicLogicResources = new TopicLogic.Resources();
            topicLogicResources.topicNavigationModel = new TopicNavigationModel.ModelImpl();
            topicLogicResources.topicCommunicator = this.communicator.topic;
            topicLogicResources.windowViewModel = this.windowViewModel;
            topicLogicResources.commandProcessor = this.commandProcessor;
            this.topicLogic = new TopicLogic.Controller(topicLogicResources);
        };
        Controller.prototype.initStateLogic = function () {
            var resources = new StateLogic.Resources();
            resources.commandProcessor = this.commandProcessor;
            this.stateLogic = new StateLogic.Controller(resources);
            this.stateLogic.initialize();
        };
        Controller.prototype.initAccountLogic = function () {
            this.viewModel.account = new Account.ViewModel();
            this.accountLogic = new AccountLogic.Controller(this.model.account, this.viewModel.account, this.commandProcessor);
        };
        Controller.prototype.dispose = function () {
            this.windows.dispose();
            this.windowLogic.dispose();
            this.stateLogic.dispose();
            this.kokiLogic.dispose();
            this.topicLogic.dispose();
            this.subscriptions.forEach(function (s) { return s.dispose(); });
        };
        return Controller;
    })();
    exports.Controller = Controller;
    var CreateNewKokiCommand = (function (_super) {
        __extends(CreateNewKokiCommand, _super);
        function CreateNewKokiCommand(data, parentTopicId, then) {
            _super.call(this);
            this.data = data;
            this.parentTopicId = parentTopicId;
            this.then = then;
        }
        return CreateNewKokiCommand;
    })(Commands.Command);
    exports.CreateNewKokiCommand = CreateNewKokiCommand;
});
