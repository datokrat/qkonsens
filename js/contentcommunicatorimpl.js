define(["require", "exports", 'discocontext', 'common', 'event'], function (require, exports, discoContext, Common, Events) {
    var ContentCommunicator = (function () {
        function ContentCommunicator() {
            this.generalContentRetrieved = new Events.EventImpl();
            this.contextRetrieved = new Events.EventImpl();
        }
        ContentCommunicator.prototype.query = function (id) {
            throw new Error('not implemented');
        };
        ContentCommunicator.prototype.queryGeneral = function (id) {
            throw new Error('not implemented');
        };
        ContentCommunicator.prototype.queryContext = function (id) {
            throw new Error('not implemented');
        };
        ContentCommunicator.prototype.updateGeneral = function (model, callbacks) {
            discoContext.Posts.filter('it.Id == this.Id', { Id: model.postId.toString() })
                .include('Content').toArray().then(function (rsp) {
                var post = rsp[0];
                if (post) {
                    discoContext.Content.attach(post.Content);
                    post.Content.Title = model.title();
                    post.Content.Text = model.text();
                    discoContext.saveChanges(callbacks.then);
                }
                else {
                    alert('ContentCommunicator.updateGeneral: Das zu ändernde Element existiert nicht (mehr)!');
                    callbacks.error(new Error('post not found'));
                }
            });
        };
        ContentCommunicator.prototype.updateContext = function (model, callbacks) {
            var contextFilter = discoContext.PostReferences.filter('it.ReferenceType.Description.Name == "Context"' + '&& it.ReferrerId == this.ReferrerId', { ReferrerId: model.postId.toString() })
                .include('ReferenceType.Description')
                .include('Referree.Content');
            var postResult;
            var contextResult;
            var context;
            Common.Callbacks.batch([
                function (r) {
                    discoContext.Posts.filter('it.Id == this.Id', { Id: model.postId.toString() }).toArray().then(function (rsp) {
                        postResult = rsp;
                        r();
                    })
                        .fail(callbacks.error);
                },
                function (r) {
                    if (postResult.length <= 0)
                        throw new Error('updateContext: Post not found');
                    else
                        r();
                },
                function (r) {
                    contextFilter.toArray().then(function (rsp) {
                        contextResult = rsp;
                        r();
                    })
                        .fail(callbacks.error);
                },
                function (r) {
                    context = Common.Coll.where(contextResult, function (item) { return item.ReferenceType.Description.Name == 'Context'; })[0].Referree;
                    if (!context)
                        throw new Error('context does not exist');
                    else
                        r();
                },
                function (r) {
                    discoContext.Content.attach(context.Content);
                    context.Content.Text = model.text();
                    discoContext.saveChanges(function () { return r(); }).fail(callbacks.error);
                },
            ], function (err) {
                if (!err)
                    callbacks.then();
                else {
                    console.log(err);
                    callbacks.error(err);
                }
            });
            contextFilter.include('ReferenceType.Description').toArray().then(function (refs) {
            });
        };
        return ContentCommunicator;
    })();
    return ContentCommunicator;
});
