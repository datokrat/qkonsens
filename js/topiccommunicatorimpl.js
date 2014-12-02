define(["require", "exports", 'event'], function(require, exports, Evt) {
    var Main = (function () {
        function Main() {
            this.childrenReceived = new Evt.EventImpl();
        }
        Main.prototype.queryChildren = function (id) {
            if (id.root)
                this.queryRootChildren();
            else
                this.queryNonRootChildren(id.id);
        };

        Main.prototype.queryRootChildren = function () {
            throw new Error('not implemented');
        };

        Main.prototype.queryNonRootChildren = function (id) {
            throw new Error('not implemented');
        };
        return Main;
    })();
    exports.Main = Main;
});
