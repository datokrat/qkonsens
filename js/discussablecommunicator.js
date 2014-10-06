define(["require", "exports", 'event', 'comment', 'discocontext'], function(require, exports, Events, Comment, discoContext) {
    var Main = (function () {
        function Main() {
            this.commentsReceived = new Events.EventImpl();
        }
        Main.prototype.queryCommentsOf = function (discussableId, err) {
            var _this = this;
            this.queryRawCommentsOf(discussableId).then(function (comments) {
                var parsed = _this.parseComments(comments);
                _this.commentsReceived.raise({ id: discussableId, comments: parsed });
            });
        };

        Main.prototype.queryRawCommentsOf = function (discussableId) {
            return discoContext.PostReferences.filter('it.ReferenceType.Description.Name != "Part" \
			&& it.ReferenceType.Description.Name != "Child" \
			&& it.ReferenceType.Description.Name != "Context" \
			&& it.Referree.Id == this.Id', { Id: discussableId }).include('Referrer.Content').toArray();
        };

        Main.prototype.parseComments = function (rawComments) {
            var _this = this;
            var comments = [];
            rawComments.forEach(function (reference) {
                var comment = _this.parseComment(reference.Referrer);
                comments.push(comment);
            });
            return comments;
        };

        Main.prototype.parseComment = function (comment) {
            var ret = new Comment.Model();
            ret.id = parseInt(comment.Id);
            ret.content().title(comment.Content.Title);
            ret.content().text(comment.Content.Text);
            return ret;
        };
        return Main;
    })();
    exports.Main = Main;
});
