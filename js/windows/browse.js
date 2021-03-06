var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../frame', '../topicnavigationviewmodel', '../topicnavigationcontroller', '../command'], function (require, exports, Frame, TopicNavigationViewModel, TopicNavigationController, Commands) {
    var Win = (function (_super) {
        __extends(Win, _super);
        function Win() {
            _super.call(this, 'browse-win-template', null);
        }
        return Win;
    })(Frame.Win);
    exports.Win = Win;
    var Controller = (function () {
        function Controller(model, win, communicator, commandProcessor) {
            this.commandProcessor = new Commands.CommandProcessor();
            this.commandProcessor.parent = commandProcessor;
            win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
            this.navigationController = new TopicNavigationController.Controller(model, win.navigation(), { communicator: communicator, commandProcessor: this.commandProcessor });
        }
        Controller.prototype.dispose = function () {
            this.navigationController.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
