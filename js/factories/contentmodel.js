define(["require", "exports", '../contentmodel'], function(require, exports, ContentModel) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.createGeneralContent = function (text, title, out) {
            var cnt = out || new ContentModel.General();
            cnt.title(title);
            cnt.text(text);
            return cnt;
        };

        Factory.prototype.createContext = function (text) {
            var cxt = new ContentModel.Context();
            cxt.text(text);
            return cxt;
        };
        return Factory;
    })();

    
    return Factory;
});
