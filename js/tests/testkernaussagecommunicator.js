define(["require", "exports", '../event', '../itemcontainer', 'tests/testcontentcommunicator', 'tests/testdiscussioncommunicator', 'tests/testratingcommunicator'], function(require, exports, Events, ItemContainer, TestContentCommunicator, TestDiscussionCommunicator, TestRatingCommunicator) {
    var TestKaCommunicator = (function () {
        function TestKaCommunicator(cxt) {
            if (typeof cxt === "undefined") { cxt = { content: new TestContentCommunicator }; }
            this.testItems = new ItemContainer.Main();
            this.discussion = new TestDiscussionCommunicator(this.testItems);
            this.rating = new TestRatingCommunicator.Main(this.testItems);
            this.received = new Events.EventImpl();
            this.content = cxt.content;
        }
        TestKaCommunicator.prototype.setTestKa = function (ka) {
            if (typeof ka.id() === 'number') {
                this.testItems.set(ka.id(), ka);
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
