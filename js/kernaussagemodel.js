define(["require", "exports", 'contentmodel', 'discussion'], function(require, exports, Content, Discussion) {
    var Model = (function () {
        function Model() {
            this.id = ko.observable();
            this.general = ko.observable(new Content.General);
            this.context = ko.observable(new Content.Context);
            this.discussion = ko.observable(new Discussion.Model);
        }
        return Model;
    })();
    exports.Model = Model;
});
