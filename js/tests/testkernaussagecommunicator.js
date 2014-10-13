var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../event', 'tests/testcontentcommunicator', 'tests/testdiscussioncommunicator'], function(require, exports, Events, TestContentCommunicator, TestDiscussionCommunicator) {
    var TestKaCommunicator = (function (_super) {
        __extends(TestKaCommunicator, _super);
        function TestKaCommunicator(cxt) {
            if (typeof cxt === "undefined") { cxt = { content: new TestContentCommunicator }; }
            _super.call(this);
            this.received = new Events.EventImpl();
            this.content = cxt.content;
        }
        TestKaCommunicator.prototype.setTestKa = function (ka) {
            if (typeof ka.id() === 'number') {
                this.testItems[ka.id()] = ka;
            } else
                throw new Error('TestKaCommunicator.setTestKa: ka.id is not a number');
        };

        TestKaCommunicator.prototype.query = function (id) {
            throw new Error('not implemented');
        };
        return TestKaCommunicator;
    })(TestDiscussionCommunicator);

    
    return TestKaCommunicator;
});
