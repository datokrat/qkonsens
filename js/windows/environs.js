var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'frame'], function (require, exports, frame) {
    var Win = (function (_super) {
        __extends(Win, _super);
        function Win(commandProcessor) {
            _super.call(this, 'environs-win-template', null);
            this.commandProcessor = commandProcessor;
            this.submitClick = function () {
                // this.commandProcessor.processCommand(new KommandoDasEsNochNichtGibt());
            };
        }
        return Win;
    })(frame.Win);
    exports.Win = Win;
});
