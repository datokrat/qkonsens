define(["require", "exports", 'discussioncommunicator', 'ratingcommunicator', 'contentcommunicatorimpl', 'event'], function(require, exports, DiscussionCommunicator, RatingCommunicator, ContentCommunicatorImpl, Events) {
    var KernaussageCommunicatorImpl = (function () {
        function KernaussageCommunicatorImpl(cxt) {
            if (typeof cxt === "undefined") { cxt = { content: new ContentCommunicatorImpl }; }
            this.discussion = new DiscussionCommunicator.Main;
            this.rating = new RatingCommunicator.Main;
            this.received = new Events.EventImpl();
            this.content = cxt.content;
        }
        KernaussageCommunicatorImpl.prototype.query = function (id) {
            throw new Error('not implemented');
        };
        return KernaussageCommunicatorImpl;
    })();

    
    return KernaussageCommunicatorImpl;
});
