define(["require", "exports", '../event', '../itemcontainer'], function(require, exports, Evt, ItemContainer) {
    var Main = (function () {
        function Main() {
            this.childrenReceived = new Evt.EventImpl();
            this.containedKokisReceived = new Evt.EventImpl();
            this.testTopics = new ItemContainer.Main();
            this.testRootTopic = [];
        }
        Main.prototype.setTestChildren = function (id, children) {
            if (id.root)
                this.testRootTopic = children;
            else
                this.testTopics.set(id.id, children);
        };

        Main.prototype.queryChildren = function (id) {
            try  {
                if (id.root)
                    this.childrenReceived.raise({ id: id, children: this.testRootTopic });
                var children = this.testTopics.get(id.id);
                this.childrenReceived.raise({ id: id, children: children });
            } catch (e) {
                //TODO
            }
        };

        Main.prototype.queryContainedKokis = function (id) {
        };
        return Main;
    })();
    exports.Main = Main;

    var Stub = (function () {
        function Stub() {
            this.childrenReceived = new Evt.EventImpl();
            this.containedKokisReceived = new Evt.EventImpl();
        }
        Stub.prototype.queryChildren = function (id) {
        };
        Stub.prototype.queryContainedKokis = function (id) {
        };
        return Stub;
    })();
    exports.Stub = Stub;
});
