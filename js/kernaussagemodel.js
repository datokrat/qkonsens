define(["require", "exports", 'contentmodel', 'rating', 'discussion'], function(require, exports, Content, Rating, Discussion) {
    var Model = (function () {
        function Model() {
            this.id = ko.observable();
            this.general = ko.observable(new Content.General);
            this.context = ko.observable(new Content.Context);
            this.rating = ko.observable(new Rating.Model);
            this.discussion = ko.observable(new Discussion.Model);
        }
        Model.prototype.set = function (other) {
            this.id(other.id());
            this.general(other.general());
            this.context(other.context());
            this.rating(other.rating());
            this.discussion(other.discussion());
        };
        return Model;
    })();
    exports.Model = Model;
});
