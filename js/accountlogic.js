var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'communicator', 'command', 'account'], function(require, exports, Communicator, Commands, Account) {
    //TODO - this is not pretty
    var Controller = (function () {
        function Controller(model, viewModel, commandProcessor) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;
            this.commandProcessor = commandProcessor;
            this.viewModel.isAdmin = ko.observable(false);

            this.initializeListOfAvailableAccounts();

            this.model.subscribe(function (account) {
                _this.updateAccountViewModel(); //order of commands may cause problems! -> not yet logged in but already did sth.
                _this.login();
                _this.commandProcessor.floodCommand(new HandleChangedAccountCommand());
            });

            this.viewModel.userName = ko.observable();
            this.viewModel.userName.subscribe(function (userName) {
                if (_this.model().userName != userName)
                    _this.model(new Account.Model({ userName: userName }));
            });

            this.updateAccountViewModel();
            this.login();
        }
        Controller.prototype.initializeListOfAvailableAccounts = function () {
            var _this = this;
            this.viewModel.availableAccounts = ko.observableArray(['anonymous']);
            this.commandProcessor.processCommand(new Communicator.GetAllUsersCommand(function (users) {
                _this.viewModel.availableAccounts(users);
            }));
        };

        Controller.prototype.updateAccountViewModel = function () {
            if (this.viewModel.userName() != this.model().userName)
                this.viewModel.userName(this.model().userName);
        };

        Controller.prototype.loginAs = function (userName) {
            console.log('name', userName);
            this.commandProcessor.processCommand(new Communicator.LoginCommand(userName));
        };

        Controller.prototype.login = function () {
            this.loginAs(this.model().userName);
        };
        return Controller;
    })();
    exports.Controller = Controller;

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
});
