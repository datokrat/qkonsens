define(["require", "exports", '../event', '../itemcontainer', 'tests/testcontentcommunicator'], function(require, exports, Events, ItemContainer, TestContentCommunicator) {
    var TestDiscussableCommunicator = (function () {
        function TestDiscussableCommunicator(testItems) {
            if (typeof testItems === "undefined") { testItems = new ItemContainer.Main(); }
            this.testItems = testItems;
            this.content = new TestContentCommunicator();
            this.commentsReceived = new Events.EventImpl();
            this.commentsReceiptError = new Events.EventImpl();
        }
        TestDiscussableCommunicator.prototype.queryCommentsOf = function (discussableId) {
            try  {
                var item = this.testItems.get(discussableId);
            } catch (e) {
                this.commentsReceiptError.raise({ discussableId: discussableId, message: 'discussableId[' + discussableId + '] not found' });

                //throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId[' + discussableId + '] not found');
                return;
            }
            this.commentsReceived.raise({ id: discussableId, comments: item.discussion().comments.get() });
        };

        TestDiscussableCommunicator.prototype.setTestDiscussable = function (discussable) {
            this.testItems.set(discussable.id(), discussable);
        };
        return TestDiscussableCommunicator;
    })();

    
    return TestDiscussableCommunicator;
});
