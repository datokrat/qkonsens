var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'model', 'topicnavigationmodel', 'frame', 'windows/none', 'windows/newkk', 'windows/intro', 'statelogic', 'topiclogic', 'kokilogic', 'windows/discussion', 'communicator', 'command', 'windowviewmodel'], function(require, exports, mdl, TopicNavigationModel, frame, noneWin, NewKkWin, IntroWin, StateLogic, TopicLogic, KokiLogic, DiscussionWindow, Communicator, Commands, WindowViewModel) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator, commandControl) {
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;
            /*private onHashChanged() {
            var hash = LocationHash.get().slice(1);
            try {
            var hashObj = JSON.parse(hash);
            this.kkWin.setState(hashObj || { kokiId: 12 });
            }
            catch(e) {
            this.kkWin.setState({ kokiId: 12 });
            }
            }*/
            this.commandProcessor = new Commands.CommandProcessor();
            this.discussionWin = new DiscussionWindow.Win();
            this.subscriptions = [];
            //var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel., { communicator: communicator.topic });
            this.initCommandControl(commandControl);

            this.initWindows();
            this.initWindowViewModel();

            this.initKokiLogic();
            this.initTopicLogic();
            this.initAccount();
            this.initStateLogic();
        }
        Controller.prototype.initWindows = function () {
            //this.kkWin = new KokiWin.Win();
            this.newKkWin = new NewKkWin.Win();
            this.introWin = new IntroWin.Win();

            this.viewModel.left = new frame.WinContainer(this.introWin);
            this.viewModel.right = new frame.WinContainer(new noneWin.Win());
            this.viewModel.center = new frame.WinContainer(new noneWin.Win());

            //this.viewModel.kkWin = this.kkWin;
            /*var globalContext = new ViewModelContext(this.viewModel.left, this.viewModel.right, this.viewModel.center);
            globalContext.konsenskisteWindow = this.kkWin;
            globalContext.discussionWindow = new DiscussionWindow.Win();
            globalContext.konsenskisteModel = this.model.konsenskiste;*/
            //this.kkWinController = new kokiWinCtr.ControllerImpl(this.model.konsenskiste(), this.kkWin, this.communicator.konsenskiste)
            //	.setContext(globalContext);
            this.newKkWinController = new NewKkWin.Controller(this.newKkWin, this.commandProcessor);
            //this.model.konsenskiste.subscribe( newKoki => this.kkWinController.setKonsenskisteModel(newKoki) );
        };

        Controller.prototype.initWindowViewModel = function () {
            this.windowViewModel = new WindowViewModel.Main({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
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
            /*this.kkWin.state.subscribe(state => LocationHash.set(JSON.stringify(state), false));
            this.subscriptions = [ LocationHash.changed.subscribe(() => this.onHashChanged()) ];
            this.onHashChanged();*/
            var resources = new StateLogic.Resources();
            resources.commandProcessor = this.commandProcessor;
            this.stateLogic = new StateLogic.Controller(resources);

            this.stateLogic.initialize();
        };

        Controller.prototype.dispose = function () {
            this.newKkWinController.dispose();
            this.stateLogic.dispose();
            this.kokiLogic.dispose();
            this.topicLogic.dispose();
            this.subscriptions.forEach(function (s) {
                return s.dispose();
            });
        };

        Controller.prototype.initAccount = function () {
            var _this = this;
            this.model.account.subscribe(function (account) {
                _this.updateAccountViewModel();
                _this.login();

                //this.reloadKk();
                _this.commandProcessor.floodCommand(new HandleChangedAccountCommand());
            });

            this.viewModel.userName = ko.observable();
            this.viewModel.userName.subscribe(function (userName) {
                if (_this.model.account().userName != userName)
                    _this.model.account(new mdl.Account({ userName: userName }));
            });

            this.updateAccountViewModel();
            this.login();
        };

        /*private reloadKk() {
        this.model.konsenskiste(this.communicator.konsenskiste.query(this.model.konsenskiste().id()));
        }*/
        Controller.prototype.login = function () {
            this.communicator.commandProcessor.processCommand(new Communicator.LoginCommand(this.model.account().userName));
        };

        Controller.prototype.updateAccountViewModel = function () {
            if (this.viewModel.userName() != this.model.account().userName)
                this.viewModel.userName(this.model.account().userName);
        };

        Controller.prototype.initCommandControl = function (parent) {
            var _this = this;
            this.commandProcessor.parent = parent && parent.commandProcessor;
            this.commandProcessor.chain.append(function (cmd) {
                /*if(cmd instanceof SelectKokiCommand) {
                this.kkWinController.setKonsenskisteModelById((<SelectKokiCommand>cmd).model.id());
                return true;
                }*/
                if (cmd instanceof CreateNewKokiCommand) {
                    var createKokiCommand = cmd;
                    var topicId = !createKokiCommand.parentTopic.id.root && createKokiCommand.parentTopic.id.id;
                    _this.communicator.konsenskiste.create(createKokiCommand.model, topicId, function (id) {
                        return createKokiCommand.then(id);
                    });
                    return true;
                }
                if (cmd instanceof OpenNewKokiWindowCommand) {
                    var openNewKokiWindowCommand = cmd;
                    _this.newKkWinController.setParentTopic(openNewKokiWindowCommand.topic);
                    _this.viewModel.left.win(_this.newKkWin);
                    return true;
                }
                if (cmd instanceof OpenDiscussionWindowCommand) {
                    var openDiscussionWindowCommand = cmd;
                    _this.discussionWin.discussable(cmd.discussableViewModel);
                    _this.viewModel.left.win(_this.discussionWin);
                    return true;
                }
                return false;
            });
        };
        return Controller;
    })();
    exports.Controller = Controller;

    /*export class SelectKokiCommand extends Commands.Command {
    constructor(public model: KonsenskisteModel.Model) { super() }
    }*/
    var CreateNewKokiCommand = (function (_super) {
        __extends(CreateNewKokiCommand, _super);
        function CreateNewKokiCommand(model, parentTopic, then) {
            _super.call(this);
            this.model = model;
            this.parentTopic = parentTopic;
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

    var HandleChangedAccountCommand = (function (_super) {
        __extends(HandleChangedAccountCommand, _super);
        function HandleChangedAccountCommand() {
            _super.apply(this, arguments);
            this.toString = function () {
                return 'HandleChangedAccountCommand';
            };
        }
        return HandleChangedAccountCommand;
    })(Commands.Command);
    exports.HandleChangedAccountCommand = HandleChangedAccountCommand;

    var OpenDiscussionWindowCommand = (function (_super) {
        __extends(OpenDiscussionWindowCommand, _super);
        function OpenDiscussionWindowCommand(discussableViewModel) {
            _super.call(this);
            this.discussableViewModel = discussableViewModel;
        }
        return OpenDiscussionWindowCommand;
    })(Commands.Command);
    exports.OpenDiscussionWindowCommand = OpenDiscussionWindowCommand;
});
