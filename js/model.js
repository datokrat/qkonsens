define(["require", "exports", 'topicnavigationmodel'], function(require, exports, topicNavigation) {
    var ModelImpl = (function () {
        function ModelImpl() {
            this.topicNavigation = new topicNavigation.ModelImpl;
            this.konsenskiste = ko.observable();
        }
        return ModelImpl;
    })();
    exports.ModelImpl = ModelImpl;
});
