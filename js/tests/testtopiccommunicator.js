define(["require", "exports", '../event', '../itemcontainer'], function(require, exports, Evt, ItemContainer) {
    var Main = (function () {
        function Main() {
            this.childrenReceived = new Evt.EventImpl();
            this.testTopics = new ItemContainer.Main();
        }
        Main.prototype.setTestChildren = function (id, children) {
            this.testTopics.set(id, children);
        };

        Main.prototype.queryChildren = function (id) {
            try  {
                var children = this.testTopics.get(id);
                this.childrenReceived.raise({ id: id, children: children });
            } catch (e) {
                //TODO
            }
        };
        return Main;
    })();
    exports.Main = Main;

    var Stub = (function () {
        function Stub() {
            this.childrenReceived = new Evt.EventImpl();
        }
        Stub.prototype.queryChildren = function (id) {
        };
        return Stub;
    })();
    exports.Stub = Stub;
});
