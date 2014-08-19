define(["require", "exports", 'topicnavigationcontroller'], function(require, exports, topicNavigationCtr) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation);
        }
        return Controller;
    })();
    exports.Controller = Controller;
});
