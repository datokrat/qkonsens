define(["require", "exports", '../konsenskistemodel'], function (require, exports, koki) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (title, text, id) {
            var konsenskiste = new koki.Model({ eventFactory: this.eventFactory });
            id && konsenskiste.id(id);
            text && konsenskiste.general().text(text);
            konsenskiste.general().title(title);
            return konsenskiste;
        };
        Factory.prototype.setEventFactory = function (value) {
            this.eventFactory = value;
            return this;
        };
        return Factory;
    })();
    exports.Factory = Factory;
});
