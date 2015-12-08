define(["require", "exports", '../event', '../common', '../itemcontainer', 'tests/testcontentcommunicator', 'tests/testratingcommunicator'], function (require, exports, Events, Common, ItemContainer, TestContentCommunicator, TestRatingCommunicator) {
    var TestDiscussableCommunicator = (function () {
        function TestDiscussableCommunicator() {
            this.content = new TestContentCommunicator();
            this.rating = new TestRatingCommunicator.Main();
            this.commentsReceived = new Events.EventImpl();
            this.commentsReceiptError = new Events.EventImpl();
            this.commentAppended = new Events.EventImpl();
            this.commentAppendingError = new Events.EventImpl();
            this.commentRemoved = new Events.EventImpl();
            this.commentRemovalError = new Events.EventImpl();
            this.testItemContainers = new ItemContainer.Many();
            this.testItemContainers.insertContainer(this.internalItemContainer = new ItemContainer.Main());
        }
        TestDiscussableCommunicator.prototype.insertTestItemContainer = function (container) {
            this.testItemContainers.insertContainer(container);
        };
        TestDiscussableCommunicator.prototype.removeTestItemContainer = function (container) {
            this.testItemContainers.removeContainer(container);
        };
        TestDiscussableCommunicator.prototype.queryCommentsOf = function (discussableId) {
            try {
                var item = this.testItemContainers.get(discussableId);
            }
            catch (e) {
                this.commentsReceiptError.raise({ discussableId: discussableId, message: 'discussableId[' + discussableId + '] not found' });
                //throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId[' + discussableId + '] not found');
                return;
            }
            this.commentsReceived.raise({ id: discussableId, comments: item.discussion().comments.get() });
        };
        TestDiscussableCommunicator.prototype.appendComment = function (discussableId, comment) {
            this.testItemContainers.get(discussableId).discussion().comments.push(comment);
            this.commentAppended.raise({ discussableId: discussableId, comment: comment });
        };
        TestDiscussableCommunicator.prototype.removeComment = function (args) {
            try {
                var comments = this.testItemContainers.get(args.discussableId).discussion().comments.get();
                var predicate = function (comment) { return comment.id == args.commentId; }; //TODO: Should comparison be based on ReferenceId instead?
                if (Common.Coll.removeOneByPredicate(comments, predicate))
                    this.commentRemoved.raise({ discussableId: args.discussableId, commentId: args.commentId });
                else
                    this.commentRemovalError.raise({ discussableId: args.discussableId, commentId: args.commentId, error: 'comment not found' });
            }
            catch (e) {
                this.commentRemovalError.raise({ discussableId: args.discussableId, commentId: args.commentId, error: 'discussable not found' });
            }
        };
        TestDiscussableCommunicator.prototype.setTestDiscussable = function (discussable) {
            this.internalItemContainer.set(discussable.id(), discussable);
        };
        return TestDiscussableCommunicator;
    })();
    return TestDiscussableCommunicator;
});
