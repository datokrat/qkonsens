var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'event', 'tests/testcontentcommunicator', 'tests/testkernaussagecommunicator', 'tests/testdiscussioncommunicator'], function(require, exports, Events, TestContentCommunicator, TestKaCommunicator, TestDiscussionCommunicator) {
    var TestKokiCommunicator = (function (_super) {
        __extends(TestKokiCommunicator, _super);
        function TestKokiCommunicator() {
            _super.call(this);
            this.received = new Events.EventImpl();
            this.content = new TestContentCommunicator();
            this.kernaussage = new TestKaCommunicator({ content: this.content });
        }
        TestKokiCommunicator.prototype.setTestKoki = function (koki) {
            if (typeof koki.id() === 'number') {
                this.testItems[koki.id()] = koki;
            } else
                throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
        };

        TestKokiCommunicator.prototype.queryKoki = function (id) {
            var koki = this.testItems[id];
            if (typeof koki !== 'undefined') {
                this.received.raise({ id: id, konsenskiste: koki });
            } else
                throw new Error('TestKokiCommunicator.queryKoki: id not found');
        };
        return TestKokiCommunicator;
    })(TestDiscussionCommunicator);

    
    return TestKokiCommunicator;
});
