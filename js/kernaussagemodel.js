define(["require", "exports"], function(require, exports) {
    var Model = (function () {
        function Model() {
            this.title = ko.observable();
        }
        return Model;
    })();
    exports.Model = Model;
});