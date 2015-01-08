var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../frame', '../controller', '../konsenskistemodel'], function(require, exports, frame, MainController, KonsenskisteModel) {
    var Win = (function (_super) {
        __extends(Win, _super);
        function Win() {
            _super.call(this, 'newkk-win-template', null);
        }
        return Win;
    })(frame.Win);
    exports.Win = Win;

    var Controller = (function () {
        function Controller(window, commandProcessor) {
            var _this = this;
            this.window = window;
            this.parentTopic = ko.observable();
            window.parentName = ko.computed(function () {
                return _this.parentTopic() && (_this.parentTopic().title() || _this.parentTopic().text());
            });
            window.title = ko.observable();
            window.text = ko.observable();

            window.clickSubmit = function () {
                var koki = new KonsenskisteModel.Model();
                koki.general().title(window.title());
                koki.general().text(window.text());
                commandProcessor.processCommand(new MainController.CreateNewKokiCommand(koki, _this.parentTopic(), function (id) {
                    koki.id(id);
                    commandProcessor.processCommand(new MainController.SelectKokiCommand(koki));
                }));
            };
        }
        Controller.prototype.setParentTopic = function (parentTopic) {
            this.parentTopic(parentTopic);
            this.window.title(null);
            this.window.text(null);
        };

        Controller.prototype.dispose = function () {
            this.window.parentName.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
