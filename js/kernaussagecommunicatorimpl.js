define(["require", "exports", 'discussioncommunicator', 'ratingcommunicator', 'contentcommunicatorimpl', 'event'], function(require, exports, DiscussionCommunicator, RatingCommunicator, ContentCommunicatorImpl, Events) {
    var Main = (function () {
        function Main(cxt) {
            if (typeof cxt === "undefined") { cxt = { content: new ContentCommunicatorImpl }; }
            this.discussion = new DiscussionCommunicator.Main;
            this.rating = new RatingCommunicator.Main;
            this.received = new Events.EventImpl();
            this.content = cxt.content;
            this.discussion.content = this.content;
        }
        Main.prototype.query = function (id) {
            throw new Error('not implemented');
        };
        return Main;
    })();
    exports.Main = Main;

    var Parser = (function () {
        function Parser() {
        }
        return Parser;
    })();
    exports.Parser = Parser;
});
