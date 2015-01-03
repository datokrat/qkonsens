define(["require", "exports"], function(require, exports) {
    var Command = (function () {
        function Command() {
        }
        return Command;
    })();
    exports.Command = Command;

    var Chain = (function () {
        function Chain() {
            this.middleware = [];
        }
        Chain.prototype.run = function (args) {
            for (var i = 0; i < this.middleware.length; ++i) {
                if (this.middleware[i](args))
                    return true;
            }
            return false;
        };

        Chain.prototype.insertAtBeginning = function (mw) {
            this.middleware = [mw].concat(this.middleware);
        };

        Chain.prototype.append = function (mw) {
            this.middleware.push(mw);
        };
        return Chain;
    })();
    exports.Chain = Chain;

    var CommandProcessor = (function () {
        function CommandProcessor() {
            this.chain = new Chain();
        }
        CommandProcessor.prototype.processCommand = function (cmd) {
            if (!this.chain.run(cmd)) {
                if (this.parent)
                    this.parent.processCommand(cmd);
                else
                    throw new Error('command not processable: ' + cmd);
            }
        };
        return CommandProcessor;
    })();
    exports.CommandProcessor = CommandProcessor;
});
