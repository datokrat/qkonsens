define(["require", "exports", '../kernaussagemodel'], function(require, exports, ka) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (text, title) {
            var kernaussage = new ka.Model();
            kernaussage.general().text(text);
            kernaussage.general().title(title);
            return kernaussage;
        };
        return Factory;
    })();
    exports.Factory = Factory;
});
