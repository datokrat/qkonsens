var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../command', 'windows/editkelement', '../kelementcommands', '../konsenskistemodel'], function (require, exports, unit, test, Common, Commands, EditKElementWin, KElementCommands, KonsenskisteModel) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.emitUpdateGeneralContentCommand = function () {
            var counter = new Common.Counter();
            var commandProcessor = new Commands.CommandProcessor();
            var win = EditKElementWin.Main.CreateEmpty(commandProcessor);
            win.model.setKElementModel(new KonsenskisteModel.Model);
            commandProcessor.chain.insertAtBeginning(function (cmd) {
                if (cmd instanceof KElementCommands.UpdateGeneralContentCommand) {
                    counter.inc('cmd');
                    return true;
                }
                return false;
            });
            win.frame.submitGeneralContent();
            test.assert(function (v) { return v.val(counter.get('cmd')) == 1; });
        };
        Tests.prototype.emitUpdateContextCommand = function () {
            var counter = new Common.Counter();
            var commandProcessor = new Commands.CommandProcessor();
            var win = EditKElementWin.Main.CreateEmpty(commandProcessor);
            win.model.setKElementModel(new KonsenskisteModel.Model);
            commandProcessor.chain.insertAtBeginning(function (cmd) {
                if (cmd instanceof KElementCommands.UpdateContextCommand) {
                    counter.inc('cmd');
                    return true;
                }
                return false;
            });
            win.frame.submitContext();
            test.assert(function (v) { return v.val(counter.get('cmd')) == 1; });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
