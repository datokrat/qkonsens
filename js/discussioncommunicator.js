define(["require", "exports", 'event', 'common', 'comment', 'discocontext'], function(require, exports, Events, Common, Comment, discoContext) {
    var Main = (function () {
        function Main() {
            this.commentsReceived = new Events.EventImpl();
            this.commentsReceiptError = new Events.EventImpl();
            this.commentAppended = new Events.EventImpl();
            this.commentAppendingError = new Events.EventImpl();
        }
        Main.prototype.queryCommentsOf = function (discussableId, err) {
            var _this = this;
            this.queryRawCommentsOf(discussableId).then(function (comments) {
                var parsed = _this.parseComments(comments);
                _this.commentsReceived.raise({ id: discussableId, comments: parsed });
            });
        };

        Main.prototype.appendComment = function (discussableId, comment) {
            var _this = this;
            var onError = function (error) {
                return _this.commentAppendingError.raise({ discussableId: discussableId, error: error });
            };
            var content;
            var post;
            var reference;
            Common.Callbacks.batch([
                function (r) {
                    content = new Disco.Ontology.Content();
                    content.CultureId = '2';
                    content.Title = comment.content().title();
                    content.Text = comment.content().text();
                    discoContext.add(content);
                    discoContext.saveChanges(function () {
                        return r();
                    }).fail(onError);
                },
                function (r) {
                    post = new Disco.Ontology.Post();
                    post.ContentId = content.Id;
                    post.PostTypeId = '2';
                    discoContext.add(post);
                    discoContext.saveChanges(function () {
                        return r();
                    }).fail(onError);
                },
                function (r) {
                    reference = new Disco.Ontology.PostReference();
                    reference.ReferrerId = post.Id;
                    reference.ReferreeId = discussableId.toString();
                    reference.ReferenceTypeId = '2';
                    discoContext.add(reference);
                    discoContext.saveChanges().then(function () {
                        return r();
                    }).fail(onError);
                }
            ], function () {
                comment.id = parseInt(post.Id);
                _this.commentAppended.raise({ discussableId: discussableId, comment: comment });
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
