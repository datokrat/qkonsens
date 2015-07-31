define(["require", "exports"], function(require, exports) {
    var ViewModel = (function () {
        function ViewModel() {
            this.environsClick = function () {
                alert('Hallo Welt');
            };
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
