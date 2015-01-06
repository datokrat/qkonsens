var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'command'], function(require, exports, Commands) {
    var LoginCommand = (function (_super) {
        __extends(LoginCommand, _super);
        function LoginCommand(userName) {
            _super.call(this);
            this.userName = userName;
        }
        LoginCommand.prototype.toString = function () {
            return 'LoginCommand ' + JSON.stringify(this);
        };
        return LoginCommand;
    })(Commands.Command);
    exports.LoginCommand = LoginCommand;
});
