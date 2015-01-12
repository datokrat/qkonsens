var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'kelement'], function(require, exports, KElement) {
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(model, viewModel, args) {
            _super.call(this, model, viewModel, args.communicator, args.commandProcessor);
        }
        return Controller;
    })(KElement.Controller);
    exports.Controller = Controller;
});
