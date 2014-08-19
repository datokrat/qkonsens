define(["require", "exports", '../kernaussagemodel'], function(require, exports, ka) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (title) {
            var kernaussage = new ka.Model();
            kernaussage.title(title);
            return kernaussage;
        };
        return Factory;
    })();
    exports.Factory = Factory;
});
