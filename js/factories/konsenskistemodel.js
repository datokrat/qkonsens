define(["require", "exports", '../konsenskistemodel'], function(require, exports, koki) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (title) {
            var konsenskiste = new koki.Model();
            konsenskiste.title(title);
            return konsenskiste;
        };
        return Factory;
    })();
    exports.Factory = Factory;
});
