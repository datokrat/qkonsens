define(["require", "exports", '../event', '../common', '../itemcontainer', 'tests/testcontentcommunicator'], function(require, exports, Events, Common, ItemContainer, TestContentCommunicator) {
    var TestDiscussableCommunicator = (function () {
        function TestDiscussableCommunicator() {
            this.content = new TestContentCommunicator();
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
            try  {
                var item = this.testItemContainers.get(discussableId);
            } catch (e) {
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
            Common.Coll.removeOneByPredicate(this.testItemContainers.get(args.discussableId).discussion().comments.get(), function (comment) {
                return comment.id == args.commentId;
            });
            this.commentRemoved.raise({ discussableId: args.discussableId, commentId: args.commentId });
        };

        TestDiscussableCommunicator.prototype.setTestDiscussable = function (discussable) {
            this.internalItemContainer.set(discussable.id(), discussable);
        };
        return TestDiscussableCommunicator;
    })();

    
    return TestDiscussableCommunicator;
});
