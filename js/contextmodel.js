define(["require", "exports"], function(require, exports) {
    var Model = (function () {
        function Model() {
            this.text = ko.observable();
        }
        return Model;
    })();

    
    return Model;
});
