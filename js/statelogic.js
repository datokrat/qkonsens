var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'locationhash', 'memory', 'command', 'kokilogic'], function (require, exports, LocationHash, Memory, Commands, KokiLogic) {
    var Controller = (function () {
        function Controller(resources) {
            /*this.commandProcessor.chain.append(cmd => {
            });*/
            var _this = this;
            this.resources = resources;
            this.commandProcessor = new Commands.CommandProcessor();
            this.state = { kokiId: 12 };
            this.disposables = new Memory.DisposableContainer();
            this.disposables.append(this.resources.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof KokiLogic.HandleChangedKokiWinStateCommand) {
                    console.log('handleChangedState', cmd);
                    var changedKokiWinState = cmd;
                    LocationHash.set(JSON.stringify(changedKokiWinState.state));
                    return true;
                }
            }));
            this.disposables.append(LocationHash.changed.subscribe(function (hashString) { return _this.onHashChangedManually(hashString); }));
        }
        Controller.prototype.initialize = function () {
            this.onHashChangedManually(LocationHash.get());
        };
        Controller.prototype.onHashChangedManually = function (hashString) {
            console.log('onChangedManually', hashString);
            var jsonString = hashString.substring(1);
            try {
                this.state = JSON.parse(jsonString);
                console.log('okilidokily');
            }
            catch (e) {
                console.error('could not parse location hash [' + jsonString + '] as JSON: ', e);
            }
            this.resources.commandProcessor.processCommand(new ChangeKokiStateCommand(this.state));
        };
        Controller.prototype.dispose = function () {
            this.disposables.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
    var Resources = (function () {
        function Resources() {
        }
        return Resources;
    })();
    exports.Resources = Resources;
    var ChangeKokiStateCommand = (function (_super) {
        __extends(ChangeKokiStateCommand, _super);
        function ChangeKokiStateCommand(state) {
            _super.call(this);
            this.state = state;
        }
        ChangeKokiStateCommand.prototype.toString = function () { return 'ChangeKokiStateCommand'; };
        return ChangeKokiStateCommand;
    })(Commands.Command);
    exports.ChangeKokiStateCommand = ChangeKokiStateCommand;
});
