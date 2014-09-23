define(["require", "exports", 'contentmodel'], function(require, exports, Content) {
    var Model = (function () {
        function Model() {
            this.general = ko.observable(new Content.General);
            this.context = ko.observable(new Content.Context);
        }
        return Model;
    })();
    exports.Model = Model;
});
