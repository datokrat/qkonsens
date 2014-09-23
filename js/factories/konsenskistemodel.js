define(["require", "exports", '../konsenskistemodel'], function(require, exports, koki) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (title, text) {
            var konsenskiste = new koki.Model({ eventFactory: this.eventFactory });
            konsenskiste.general().title(title);
            konsenskiste.general().text(text);
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
