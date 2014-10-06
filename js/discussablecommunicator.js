define(["require", "exports", 'event'], function(require, exports, Events) {
    var Main = (function () {
        function Main() {
            this.commentsReceived = new Events.EventImpl();
        }
        Main.prototype.queryCommentsOf = function (discussableId) {
            throw new Error('not implemented');
        };
        return Main;
    })();
    exports.Main = Main;
});
