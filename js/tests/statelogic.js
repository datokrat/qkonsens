var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../command', '../kokilogic', '../locationhash', '../statelogic'], function (require, exports, unit, test, Common, Commands, KokiLogic, LocationHash, StateLogic) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.setUp = function () {
            this.counter = new Common.Counter();
        };
        Tests.prototype.handleChangedHash = function () {
            var _this = this;
            var resources = {
                commandProcessor: new Commands.CommandProcessor()
            };
            var stateLogic = new StateLogic.Controller(resources);
            resources.commandProcessor.chain.insertAtBeginning(function (cmd) {
                _this.counter.inc('cmd');
                test.assert(function (v) { return cmd instanceof StateLogic.ChangeKokiStateCommand; });
                test.assert(function (v) { return v.val(cmd.state.kokiId) == 3; });
                return true;
            });
            LocationHash.changed.raise('#{"kokiId":3}');
            test.assert(function (v) { return v.val(_this.counter.get('cmd')) == 1; });
            stateLogic.dispose();
        };
        Tests.prototype.handleChangedKokiState = function () {
            var resources = {
                commandProcessor: new Commands.CommandProcessor()
            };
            var stateLogic = new StateLogic.Controller(resources);
            resources.commandProcessor.processCommand(new KokiLogic.HandleChangedKokiWinStateCommand({ kokiId: 3 }));
            test.assert(function (v) { return v.val(location.hash) == '#{"kokiId":3}'; });
            stateLogic.dispose();
        };
        Tests.prototype.initialize = function () {
            var _this = this;
            var resources = {
                commandProcessor: new Commands.CommandProcessor()
            };
            var stateLogic = new StateLogic.Controller(resources);
            resources.commandProcessor.chain.append(function (cmd) {
                _this.counter.inc('changed');
                test.assert(function (v) { return cmd instanceof StateLogic.ChangeKokiStateCommand; });
                return true;
            });
            stateLogic.initialize();
            test.assert(function (v) { return v.val(_this.counter.get('changed')) == 1; });
            stateLogic.dispose();
        };
        Tests.prototype.initializeWithEmptyHash = function () {
            var _this = this;
            LocationHash.changed.clear();
            location.hash = '';
            var resources = {
                commandProcessor: new Commands.CommandProcessor()
            };
            var stateLogic = new StateLogic.Controller(resources);
            resources.commandProcessor.chain.append(function (cmd) {
                _this.counter.inc('changed');
                test.assert(function (v) { return cmd instanceof StateLogic.ChangeKokiStateCommand; });
                test.assert(function (v) { return v.val(cmd.state.kokiId) == 12; });
                return true;
            });
            stateLogic.initialize();
            test.assert(function (v) { return v.val(_this.counter.get('changed')) == 1; });
            stateLogic.dispose();
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
