define(["require", "exports"], function (require, exports) {
    var Context = (function () {
        function Context() {
            this.text = ko.observable();
        }
        Context.prototype.set = function (context) {
            this.postId = context.postId;
            this.text(context.text());
        };
        return Context;
    })();
    exports.Context = Context;
    var General = (function () {
        function General() {
            this.title = ko.observable();
            this.text = ko.observable();
        }
        General.prototype.set = function (content) {
            this.postId = content.postId;
            this.title(content.title());
            this.text(content.text());
        };
        return General;
    })();
    exports.General = General;
});
