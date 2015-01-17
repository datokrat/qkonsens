var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../frame', '../kelementcommands'], function(require, exports, frame, KElementCommands) {
    var Win = (function (_super) {
        __extends(Win, _super);
        function Win() {
            _super.call(this, 'editkelement-win-template', null);
        }
        return Win;
    })(frame.Win);
    exports.Win = Win;

    var Controller = (function () {
        function Controller(win, parentCommandProcessor) {
            var _this = this;
            this.win = win;
            this.parentCommandProcessor = parentCommandProcessor;
            this.win.title = ko.observable();
            this.win.text = ko.observable();
            this.win.context = ko.observable();

            this.win.submitGeneralContent = function () {
                var cmd = new KElementCommands.UpdateGeneralContentCommand(_this.kElement.general(), { then: function () {
                        _this.kElement.general().title(_this.win.title());
                        _this.kElement.general().text(_this.win.text());
                    } });
                _this.parentCommandProcessor.processCommand(cmd);
            };
        }
        Controller.prototype.setModel = function (kElement) {
            this.kElement = kElement;
            this.win.title(kElement.general().title());
            this.win.text(kElement.general().text());
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
