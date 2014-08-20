define(["require", "exports", '../contentmodel'], function(require, exports, content) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (text, title) {
            var cnt = new content.Model();
            cnt.title(title);
            cnt.text(text);
            return cnt;
        };
        return Factory;
    })();
    exports.Factory = Factory;
});
