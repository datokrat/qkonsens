define(["require", "exports", 'event', 'tests/testcontentcommunicator'], function(require, exports, Events, TestContentCommunicator) {
    var TestDiscussableCommunicator = (function () {
        function TestDiscussableCommunicator(testItems) {
            if (typeof testItems === "undefined") { testItems = ko.observable({}); }
            this.testItems = testItems;
            this.content = new TestContentCommunicator();
            this.commentsReceived = new Events.EventImpl();
        }
        TestDiscussableCommunicator.prototype.queryCommentsOf = function (discussableId) {
            var item = this.testItems()[discussableId];
            if (typeof item !== 'undefined')
                this.commentsReceived.raise({ id: discussableId, comments: item.discussion().comments.get() });
            else
                throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId[' + discussableId + '] not found');
        };

        TestDiscussableCommunicator.prototype.setTestDiscussable = function (discussable) {
            this.testItems()[discussable.id()] = discussable;
        };
        return TestDiscussableCommunicator;
    })();

    
    return TestDiscussableCommunicator;
});
