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
                this.commentsReceived.raise({ id: discussableId, comments: item.discussion().comments.get() });
            else
                throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId[' + discussableId + '] not found');
        };

        TestDiscussableCommunicator.prototype.setTestDiscussable = function (discussable) {
            this.testItems[discussable.id()] = discussable;
        };
        return TestDiscussableCommunicator;
    })();

    
    return TestDiscussableCommunicator;
});
