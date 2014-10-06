define(["require", "exports", 'event'], function(require, exports, Events) {
    var TestDiscussableCommunicator = (function () {
        function TestDiscussableCommunicator() {
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
