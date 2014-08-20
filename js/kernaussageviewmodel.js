define(["require", "exports", 'contentviewmodel'], function(require, exports, Content) {
    var ViewModel = (function () {
        function ViewModel() {
            this.content = new Content.ViewModel();
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
