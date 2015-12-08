define(["require", "exports", 'communicator', 'konsenskistecommunicatorimpl', 'topiccommunicatorimpl', 'command', 'disco', 'discocontext'], function (require, exports, Communicator, KokiCommunicatorImpl, TopicImpl, Commands, disco, discoContext) {
    var CommunicatorImpl = (function () {
        function CommunicatorImpl() {
            this.konsenskiste = new KokiCommunicatorImpl.Main;
            this.topic = new TopicImpl.Main();
            this.commandProcessor = new Commands.CommandProcessor();
            this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof Communicator.LoginCommand) {
                    var typedCmd = cmd;
                    disco.AuthData = function () { return ({ user: typedCmd.userName, password: 'password' }); };
                    return true;
                }
                return false;
            });
            this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof Communicator.GetAllUsersCommand) {
                    var typedCmd = cmd;
                    discoContext.Users.toArray().then(function (users) { return typedCmd.then(users.map(function (u) { return u.Alias; })); });
                    return true;
                }
                return false;
            });
        }
        return CommunicatorImpl;
    })();
    return CommunicatorImpl;
});
