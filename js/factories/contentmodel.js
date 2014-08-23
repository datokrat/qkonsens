define(["require", "exports", '../contentmodel'], function(require, exports, content) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (text, title, out) {
            var cnt = out || new content.Model();
            cnt.title(title);
            cnt.text(text);
            return cnt;
        };

        Factory.prototype.createWithContext = function (text, title, context) {
            var cnt = new content.WithContext();
            this.create(text, title, cnt);

            cnt.context().text(context);
            return cnt;
        };
        return Factory;
    })();
    exports.Factory = Factory;
});
