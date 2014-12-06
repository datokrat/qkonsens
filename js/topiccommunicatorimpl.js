define(["require", "exports", 'event', 'topic', 'discocontext'], function(require, exports, Evt, Topic, discoContext) {
    var Main = (function () {
        function Main() {
            this.childrenReceived = new Evt.EventImpl();
            this.parser = new Parser();
        }
        Main.prototype.queryChildren = function (id) {
            if (id.root)
                this.queryRootChildren();
            else
                this.queryNonRootChildren(id.id);
        };

        Main.prototype.queryRootChildren = function () {
            var _this = this;
            var parentlessFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name != 'Child';
            });

            discoContext.Posts.filter(function (it) {
                return it.PostType.Description.Name == 'Topic' && it.RefersTo.every(this.parentlessFilter);
            }, { parentlessFilter: parentlessFilter }).include('Content').toArray().then(function (topics) {
                var rootChildren = topics.map(function (raw) {
                    return _this.parser.parseTopic(raw);
                });
                _this.childrenReceived.raise({ id: { root: true, id: undefined }, children: rootChildren });
            });
        };

        Main.prototype.queryNonRootChildren = function (id) {
            var _this = this;
            var childFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name == 'Child' && it.ReferreeId == this.Id;
            }, { Id: id });

            discoContext.Posts.filter(function (it) {
                return it.PostType.Description.Name == 'Topic' && it.RefersTo.some(this.childFilter);
            }, { childFilter: childFilter }).include('Content').toArray().then(function (topics) {
                var rootChildren = topics.map(function (raw) {
                    return _this.parser.parseTopic(raw);
                });
                _this.childrenReceived.raise({ id: { id: id }, children: rootChildren });
            });
        };
        return Main;
    })();
    exports.Main = Main;

    var Parser = (function () {
        function Parser() {
        }
        Parser.prototype.parseTopic = function (discoTopic) {
            var topic = new Topic.Model();
            topic.id = { id: parseInt(discoTopic.Id) };
            topic.title(discoTopic.Content.Title);
            topic.text(discoTopic.Content.Text);
            return topic;
        };
        return Parser;
    })();
    exports.Parser = Parser;
});
