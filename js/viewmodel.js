define(["require", "exports", 'topicnavigationviewmodel'], function(require, exports, topicNavigation) {
    var ViewModel = (function () {
        function ViewModel() {
            this.topicNavigation = new topicNavigation.ViewModel();
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
