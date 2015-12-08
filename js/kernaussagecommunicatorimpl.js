define(["require", "exports", 'discussioncommunicatorimpl', 'ratingcommunicatorimpl', 'contentcommunicatorimpl', 'event'], function (require, exports, DiscussionCommunicatorImpl, RatingCommunicatorImpl, ContentCommunicatorImpl, Events) {
    var Main = (function () {
        function Main(cxt) {
            if (cxt === void 0) { cxt = { content: new ContentCommunicatorImpl }; }
            this.discussion = new DiscussionCommunicatorImpl.Main;
            this.rating = new RatingCommunicatorImpl.Main;
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
