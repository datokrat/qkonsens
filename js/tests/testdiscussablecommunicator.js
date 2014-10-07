define(["require", "exports", 'event', 'tests/testcontentcommunicator'], function(require, exports, Events, TestContentCommunicator) {
    var TestDiscussableCommunicator = (function () {
        function TestDiscussableCommunicator() {
            this.content = new TestContentCommunicator();
            this.commentsReceived = new Events.EventImpl();
            this.testItems = {};
        }
        TestDiscussableCommunicator.prototype.queryCommentsOf = function (discussableId) {
            var item = this.testItems[discussableId];
            if (typeof item !== 'undefined')
                this.commentsReceived.raise({ id: discussableId, comments: item.comments.get() });
            else
                throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId not found');
        };
        return TestDiscussableCommunicator;
    })();

    
    return TestDiscussableCommunicator;
});
