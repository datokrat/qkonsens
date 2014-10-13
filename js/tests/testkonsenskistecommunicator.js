define(["require", "exports", 'event', 'tests/testcontentcommunicator', 'tests/testkernaussagecommunicator', 'tests/testdiscussioncommunicator'], function(require, exports, Events, TestContentCommunicator, TestKaCommunicator, TestDiscussionCommunicator) {
    var TestKokiCommunicator = (function () {
        function TestKokiCommunicator() {
            this.received = new Events.EventImpl();
            this.testItems = ko.observable({});
            this.discussion = new TestDiscussionCommunicator(this.testItems);
            this.content = new TestContentCommunicator();
            this.kernaussage = new TestKaCommunicator({ content: this.content });
        }
        TestKokiCommunicator.prototype.setTestKoki = function (koki) {
            if (typeof koki.id() === 'number') {
                this.testItems()[koki.id()] = koki;
            } else
                throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
        };

        TestKokiCommunicator.prototype.queryKoki = function (id) {
            var koki = this.testItems()[id];
            if (typeof koki !== 'undefined') {
                this.received.raise({ id: id, konsenskiste: koki });
            } else
                throw new Error('TestKokiCommunicator.queryKoki: id not found');
        };
        return TestKokiCommunicator;
    })();

    
    return TestKokiCommunicator;
});
