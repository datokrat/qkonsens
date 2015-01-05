define(["require", "exports", 'event', 'common', 'comment', 'contentcommunicatorimpl', 'ratingcommunicatorimpl', 'discocontext'], function(require, exports, Events, Common, Comment, ContentCommunicatorImpl, RatingCommunicatorImpl, discoContext) {
    var Main = (function () {
        function Main() {
            this.content = new ContentCommunicatorImpl();
            this.rating = new RatingCommunicatorImpl.Main();
            this.commentsReceived = new Events.EventImpl();
            this.commentsReceiptError = new Events.EventImpl();
            this.commentAppended = new Events.EventImpl();
            this.commentAppendingError = new Events.EventImpl();
            this.commentRemoved = new Events.EventImpl();
            this.commentRemovalError = new Events.EventImpl();
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
                return _this.commentAppendingError.raise({ discussableId: discussableId, comment: comment, error: error });
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

        Main.prototype.removeComment = function (args) {
            var _this = this;
            var onError = function (error) {
                return _this.commentRemovalError.raise({ discussableId: args.discussableId, commentId: args.commentId, error: error });
            };
            var data = {
                commentId: args.commentId,
                discussableId: args.discussableId,
                referredTimes: 0,
                refersTimes: 0,
                references: null,
                referenceToDelete: null
            };
            var references;
            Common.Callbacks.batch([
                function (r) {
                    Common.Callbacks.atOnce([
                        function (r) {
                            return discoContext.PostReferences.filter('it.ReferreeId == this.commentId', data).toArray().then(function (refs) {
                                data.referredTimes = refs.length;
                                r();
                            }).fail(onError);
                        },
                        function (r) {
                            return discoContext.PostReferences.filter('it.ReferrerId == this.commentId', data).toArray().then(function (refs) {
                                data.refersTimes = refs.length;
                                r();
                            }).fail(onError);
                        },
                        function (r) {
                            return discoContext.PostReferences.filter('it.ReferrerId == this.commentId && it.ReferreeId == this.discussableId ' + '&& it.ReferenceType.Description.Name != "Part"' + '&& it.ReferenceType.Description.Name != "Child"' + '&& it.ReferenceType.Description.Name != "Context"', data).toArray().then(function (refs) {
                                data.references = refs;
                                r();
                            }).fail(onError);
                        }
                    ], r);
                },
                function (r) {
                    data.referenceToDelete = data.references[0];
                    if (data.referenceToDelete)
                        discoContext.PostReferences.remove(new Disco.Ontology.PostReference({ Id: data.referenceToDelete.Id }));
                    discoContext.saveChanges().then(function () {
                        return r();
                    }).fail(onError);
                },
                function (r) {
                    var removedReferences = data.referenceToDelete ? 1 : 0;
                    var stillHasReferences = data.referredTimes != 0 || data.refersTimes - removedReferences != 0;
                    if (!stillHasReferences) {
                        //discoContext.Posts.remove(new Disco.Ontology.Post({ Id: args.commentId }));
                        //discoContext.saveChanges().then(() => r).fail(onError);
                        console.warn('This comment should be deleted now. Due to technical problems, that\'s not possible so far.');
                        r();
                    } else
                        r();
                }
            ], function () {
                _this.commentRemoved.raise({ discussableId: args.discussableId, commentId: args.commentId });
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
