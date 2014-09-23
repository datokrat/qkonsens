define(["require", "exports"], function(require, exports) {
    var Context = (function () {
        function Context() {
            this.text = ko.observable();
        }
        Context.prototype.set = function (context) {
            this.id = context.id;
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
            this.title(content.title());
            this.text(content.text());
        };
        return General;
    })();
    exports.General = General;
});
