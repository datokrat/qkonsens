var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../frame', '../topicnavigationviewmodel', '../topicnavigationcontroller'], function(require, exports, Frame, TopicNavigationViewModel, TopicNavigationController) {
    var Win = (function (_super) {
        __extends(Win, _super);
        function Win() {
            _super.call(this, 'browse-win-template', null);
        }
        return Win;
    })(Frame.Win);
    exports.Win = Win;

    var Controller = (function () {
        function Controller(model, win, communicator) {
            win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
            this.navigationController = new TopicNavigationController.Controller(model, win.navigation(), communicator);
        }
        return Controller;
    })();
    exports.Controller = Controller;
});
