define(["require", "exports"], function(require, exports) {
    var Topic = (function () {
        function Topic(id, parent) {
            this.parent = ko.observable();
            //public children = ko.observableArray<Topic>();
            //public kks = ko.observableArray<Konsenskiste>();
            this.title = ko.observable();
            this.text = ko.observable();
            this.id = id;
            this.parent(parent);
        }
        return Topic;
    })();
    exports.Topic = Topic;
});
