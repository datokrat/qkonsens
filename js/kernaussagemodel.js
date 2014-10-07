define(["require", "exports", 'observable', 'contentmodel'], function(require, exports, Obs, Content) {
    var Model = (function () {
        function Model() {
            this.general = ko.observable(new Content.General);
            this.context = ko.observable(new Content.Context);
            this.comments = new Obs.ObservableArrayExtender(ko.observableArray());
        }
        return Model;
    })();
    exports.Model = Model;
});
