define(["require", "exports"], function(require, exports) {
    var Main = (function () {
        function Main() {
        }
        Main.prototype.queryChildren = function (id) {
            throw new Error('not implemented');
        };
        return Main;
    })();
    exports.Main = Main;
});
