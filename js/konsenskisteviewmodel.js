define(["require", "exports", 'contentviewmodel'], function(require, exports, content) {
    var ViewModel = (function () {
        function ViewModel() {
            this.content = new content.ViewModel();
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
