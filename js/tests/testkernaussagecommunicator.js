define(["require", "exports", '../event', 'tests/testcontentcommunicator', 'tests/testdiscussioncommunicator'], function(require, exports, Events, TestContentCommunicator, TestDiscussionCommunicator) {
    var TestKaCommunicator = (function () {
        function TestKaCommunicator(cxt) {
            if (typeof cxt === "undefined") { cxt = { content: new TestContentCommunicator }; }
            this.testItems = ko.observable({});
            this.discussion = new TestDiscussionCommunicator(this.testItems);
            this.received = new Events.EventImpl();
            this.content = cxt.content;
        }
        TestKaCommunicator.prototype.setTestKa = function (ka) {
            if (typeof ka.id() === 'number') {
                this.testItems()[ka.id()] = ka;
            } else
                throw new Error('TestKaCommunicator.setTestKa: ka.id is not a number');
        };

        TestKaCommunicator.prototype.query = function (id) {
            throw new Error('not implemented');
        };
        return TestKaCommunicator;
    })();

    
    return TestKaCommunicator;
});
