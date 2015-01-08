var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'model', 'locationhash', 'frame', 'windows/none', 'windows/konsenskiste', 'windows/newkk', 'topiclogic', 'windows/discussion', 'windows/konsenskistecontroller', 'communicator', 'viewmodelcontext', 'command', 'windowviewmodel'], function(require, exports, mdl, LocationHash, frame, noneWin, KokiWin, NewKkWin, TopicLogic, DiscussionWindow, kokiWinCtr, Communicator, ViewModelContext, Commands, WindowViewModel) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator, commandControl) {
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;
            this.commandControl = { commandProcessor: new Commands.CommandProcessor() };
            this.subscriptions = [];
            //var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel., { communicator: communicator.topic });
            this.initCommandControl(commandControl);

            this.initWindows();

            this.initTopicNavigation();
            this.initAccount();
            this.initState();
        }
        Controller.prototype.initWindows = function () {
            var _this = this;
            this.kkWin = new KokiWin.Win();

            //this.browseWin = new BrowseWin.Win();
            this.newKkWin = new NewKkWin.Win();

            this.viewModel.left = new frame.WinContainer(new noneWin.Win());
            this.viewModel.right = new frame.WinContainer(new noneWin.Win());
            this.viewModel.center = new frame.WinContainer(this.kkWin);

            //this.viewModel.browseWin = this.browseWin;
            this.viewModel.kkWin = this.kkWin;

            var globalContext = new ViewModelContext(this.viewModel.left, this.viewModel.right, this.viewModel.center);
            globalContext.konsenskisteWindow = this.kkWin;
            globalContext.discussionWindow = new DiscussionWindow.Win();
            globalContext.konsenskisteModel = this.model.konsenskiste;

            this.kkWinController = new kokiWinCtr.Controller(this.model.konsenskiste(), this.kkWin, this.communicator.konsenskiste).setContext(globalContext);

            //this.browseWinController = new BrowseWin.Controller(this.model.topicNavigation, this.browseWin, this.communicator.topic, this.commandControl);
            this.newKkWinController = new NewKkWin.Controller(this.newKkWin, this.commandControl.commandProcessor);

            this.model.konsenskiste.subscribe(function (newKoki) {
                return _this.kkWinController.setKonsenskisteModel(newKoki);
            });
        };

        Controller.prototype.initTopicNavigation = function () {
            var topicLogicResources = new TopicLogic.Resources();
            topicLogicResources.topicNavigationModel = this.model.topicNavigation;
            topicLogicResources.topicCommunicator = this.communicator.topic;
            topicLogicResources.windowViewModel = new WindowViewModel.Main({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
            topicLogicResources.commandProcessor = this.commandControl.commandProcessor;

            this.topicLogic = new TopicLogic.Controller(topicLogicResources);
        };

        Controller.prototype.initState = function () {
            var _this = this;
            this.kkWin.state.subscribe(function (state) {
                return LocationHash.set(JSON.stringify(state), false);
            });
            this.subscriptions = [LocationHash.changed.subscribe(function () {
                    return _this.onHashChanged();
                })];
            this.onHashChanged();
        };

        Controller.prototype.dispose = function () {
            this.kkWinController.dispose();

            //this.browseWinController.dispose();
            this.newKkWinController.dispose();
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
                _this.reloadKk();
            });

            this.viewModel.userName = ko.observable();
            this.viewModel.userName.subscribe(function (userName) {
                if (_this.model.account().userName != userName)
                    _this.model.account(new mdl.Account({ userName: userName }));
            });

            this.updateAccountViewModel();
            this.login();
        };

        Controller.prototype.reloadKk = function () {
            this.model.konsenskiste(this.communicator.konsenskiste.query(this.model.konsenskiste().id()));
        };

        Controller.prototype.login = function () {
            this.communicator.commandProcessor.processCommand(new Communicator.LoginCommand(this.model.account().userName));
        };

        Controller.prototype.updateAccountViewModel = function () {
            if (this.viewModel.userName() != this.model.account().userName)
                this.viewModel.userName(this.model.account().userName);
        };

        Controller.prototype.initCommandControl = function (parent) {
            var _this = this;
            this.commandControl.commandProcessor.parent = parent && parent.commandProcessor;
            this.commandControl.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof SelectKokiCommand) {
                    _this.kkWinController.setKonsenskisteModelById(cmd.model.id());
                    return true;
                } else if (cmd instanceof CreateNewKokiCommand) {
                    var createKokiCommand = cmd;
                    var topicId = !createKokiCommand.parentTopic.id.root && createKokiCommand.parentTopic.id.id;
                    _this.communicator.konsenskiste.create(createKokiCommand.model, topicId, function (id) {
                        return createKokiCommand.then(id);
                    });
                    return true;
                } else if (cmd instanceof OpenNewKokiWindowCommand) {
                    var openNewKokiWindowCommand = cmd;
                    _this.newKkWinController.setParentTopic(openNewKokiWindowCommand.topic);
                    _this.viewModel.left.win(_this.newKkWin);
                    return true;
                }
                return false;
            });
        };

        Controller.prototype.onHashChanged = function () {
            var hash = LocationHash.get().slice(1);
            try  {
                var hashObj = JSON.parse(hash);
                this.kkWin.setState(hashObj || { kokiId: 12 });
            } catch (e) {
                this.kkWin.setState({ kokiId: 12 });
            }
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var SelectKokiCommand = (function (_super) {
        __extends(SelectKokiCommand, _super);
        function SelectKokiCommand(model) {
            _super.call(this);
            this.model = model;
        }
        return SelectKokiCommand;
    })(Commands.Command);
    exports.SelectKokiCommand = SelectKokiCommand;

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
});
