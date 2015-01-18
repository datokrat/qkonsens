define(["require", "exports"], function(require, exports) {
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
});
