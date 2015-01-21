define(["require", "exports"], function(require, exports) {
    //TODO: add callback
    var LoginCommand = (function () {
        function LoginCommand(userName) {
            this.userName = userName;
        }
        LoginCommand.prototype.toString = function () {
            return 'LoginCommand ' + JSON.stringify(this);
        };
        return LoginCommand;
    })();
    exports.LoginCommand = LoginCommand;

    var GetAllUsersCommand = (function () {
        function GetAllUsersCommand(then) {
            this.then = then;
        }
        GetAllUsersCommand.prototype.toString = function () {
            return 'GetAllUsersCommand';
        };
        return GetAllUsersCommand;
    })();
    exports.GetAllUsersCommand = GetAllUsersCommand;
});
