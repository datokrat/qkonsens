define(["require", "exports", 'discocontext', 'event'], function(require, exports, discoContext, Events) {
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
            discoContext.Posts.filter('it.Id == this.Id', { Id: model.postId.toString() }).include('Content').toArray().then(function (rsp) {
                var post = rsp[0];
                if (post) {
                    discoContext.Content.attach(post.Content);
                    post.Content.Title = model.title();
                    post.Content.Text = model.text();
                    discoContext.saveChanges(callbacks.then);
                } else {
                    alert('ContentCommunicator.updateGeneral: Das zu ändernde Element existiert nicht (mehr)!');
                    callbacks.error(new Error('post not found'));
                }
            });
        };
        return ContentCommunicator;
    })();

    
    return ContentCommunicator;
});
