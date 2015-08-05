var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'topicnavigationmodel', 'memory', 'frame', 'windows/none', 'windows/newkk', 'windows/intro', 'windows/editkelement', 'statelogic', 'topiclogic', 'kokilogic', 'accountlogic', 'account', 'windows/discussion', 'windows/environs', 'command', 'kelementcommands', 'windowviewmodel'], function(require, exports, TopicNavigationModel, Memory, frame, noneWin, NewKkWin, IntroWin, EditKElementWin, StateLogic, TopicLogic, KokiLogic, AccountLogic, Account, DiscussionWindow, EnvironsWindows, Commands, KElementCommands, WindowViewModel) {
    var WindowLogic = (function () {
        function WindowLogic(windowViewModel, windows, commandProcessor) {
            this.windowViewModel = windowViewModel;
            this.windows = windows;
            this.commandProcessor = commandProcessor;
            this.disposables = new Memory.DisposableContainer();
            this.initCommandProcessor();
        }
        WindowLogic.prototype.initCommandProcessor = function () {
            var _this = this;
            this.disposables.append(this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof OpenNewKokiWindowCommand) {
                    var openNewKokiWindowCommand = cmd;
                    _this.windows.newKkWindow.model.setParentTopic(openNewKokiWindowCommand.topic);
                    _this.windowViewModel.fillFrameWithWindow(1 /* Left */, _this.windows.newKkWindow.frame);
                    return true;
                }
                if (cmd instanceof KElementCommands.OpenEditKElementWindowCommand) {
                    var editKElementWindowCommand = cmd;
                    _this.windows.editKElementWindow.model.setKElementModel(editKElementWindowCommand.model);
                    _this.windowViewModel.fillFrameWithWindow(1 /* Left */, _this.windows.editKElementWindow.frame);
                    return true;
                }
            }));
        };

        WindowLogic.prototype.dispose = function () {
            this.disposables.dispose();
        };
        return WindowLogic;
    })();
    exports.WindowLogic = WindowLogic;

    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;
            this.commandProcessor = new Commands.CommandProcessor();
            this.discussionWin = new DiscussionWindow.Win();
            this.subscriptions = [];
            //var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel., { communicator: communicator.topic });
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
                    _this.communicator.konsenskiste.create(createKokiCommand.data, topicId, function (id) {
                        return createKokiCommand.then(id);
                    });
                    return true;
                }
                if (cmd instanceof OpenDiscussionWindowCommand) {
                    var openDiscussionWindowCommand = cmd;
                    _this.discussionWin.discussable(cmd.discussableViewModel);
                    _this.viewModel.left.win(_this.discussionWin);
                    return true;
                }
                if (cmd instanceof OpenEnvironsWindowCommand) {
                    _this.viewModel.left.win(new EnvironsWindows.Win());
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
                        }, error: function () {
                        } });
                    return true;
                }
                return false;
            });
        };

        Controller.prototype.initWindows = function () {
            this.windows = new Windows(this.commandProcessor);
            this.introWin = new IntroWin.Win();

            this.viewModel.left = new frame.WinContainer(this.introWin);
            this.viewModel.right = new frame.WinContainer(new noneWin.Win());
            this.viewModel.center = new frame.WinContainer(new noneWin.Win());
        };

        Controller.prototype.initWindowViewModel = function () {
            this.windowViewModel = new WindowViewModel.Main({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
        };

        Controller.prototype.initWindowLogic = function () {
            this.windowLogic = new WindowLogic(this.windowViewModel, this.windows, this.commandProcessor);
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
            topicLogicResources.topicNavigationModel = new TopicNavigationModel.ModelImpl(); //this.model.topicNavigation;
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
            this.subscriptions.forEach(function (s) {
                return s.dispose();
            });
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var Windows = (function () {
        function Windows(commandProcessor) {
            this.newKkWindow = NewKkWin.Main.CreateEmpty(commandProcessor);
            this.editKElementWindow = EditKElementWin.Main.CreateEmpty(commandProcessor);
        }
        Windows.prototype.dispose = function () {
            this.newKkWindow.dispose();
            this.editKElementWindow.dispose();
        };
        return Windows;
    })();
    exports.Windows = Windows;

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

    var OpenNewKokiWindowCommand = (function (_super) {
        __extends(OpenNewKokiWindowCommand, _super);
        function OpenNewKokiWindowCommand(topic) {
            _super.call(this);
            this.topic = topic;
        }
        return OpenNewKokiWindowCommand;
    })(Commands.Command);
    exports.OpenNewKokiWindowCommand = OpenNewKokiWindowCommand;

    var OpenDiscussionWindowCommand = (function (_super) {
        __extends(OpenDiscussionWindowCommand, _super);
        function OpenDiscussionWindowCommand(discussableViewModel) {
            _super.call(this);
            this.discussableViewModel = discussableViewModel;
        }
        return OpenDiscussionWindowCommand;
    })(Commands.Command);
    exports.OpenDiscussionWindowCommand = OpenDiscussionWindowCommand;

    var OpenEnvironsWindowCommand = (function (_super) {
        __extends(OpenEnvironsWindowCommand, _super);
        function OpenEnvironsWindowCommand() {
            _super.call(this);
        }
        return OpenEnvironsWindowCommand;
    })(Commands.Command);
    exports.OpenEnvironsWindowCommand = OpenEnvironsWindowCommand;
});
