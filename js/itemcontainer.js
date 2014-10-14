define(["require", "exports"], function(require, exports) {
    var Main = (function () {
        function Main() {
            this.items = {};
        }
        Main.prototype.get = function (id) {
            var ret = this.items[id];
            if (ret)
                return ret;
            else
                throw new Error('item does not exist: id = ' + id);
        };

        Main.prototype.set = function (id, value) {
            return this.items[id] = value;
        };
        return Main;
    })();
    exports.Main = Main;
});
