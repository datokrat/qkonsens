define(["require", "exports", 'event', 'topic', 'konsenskistecommunicatorimpl', 'discocontext'], function(require, exports, Evt, Topic, KokiCommunicator, discoContext) {
    var Main = (function () {
        function Main() {
            this.childrenReceived = new Evt.EventImpl();
            this.containedKokisReceived = new Evt.EventImpl();
            this.topicParser = new Parser();
            this.kokiParser = new KokiCommunicator.Parser();
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
                    return _this.topicParser.parseTopic(raw);
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
                var children = topics.map(function (raw) {
                    return _this.topicParser.parseTopic(raw);
                });
                _this.childrenReceived.raise({ id: { id: id }, children: children });
            });
        };

        Main.prototype.queryContainedKokis = function (id) {
            if (!id.root)
                this.queryContainedKokisOfNonRoot(id.id);
            else
                this.containedKokisReceived.raise({ id: id, kokis: [] });
        };

        Main.prototype.queryContainedKokisOfNonRoot = function (id) {
            var _this = this;
            var dependenceFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferreeId == this.Id;
            }, { Id: id });
            var kaRefFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name == 'Part';
            });

            discoContext.Posts.filter(function (it) {
                return it.RefersTo.some(this.dependenceFilter) && it.ReferredFrom.some(this.kaRefFilter);
            }, { dependenceFilter: dependenceFilter, kaRefFilter: kaRefFilter }).include('Content').toArray().then(function (rawKokis) {
                var kokis = rawKokis.map(function (raw) {
                    return _this.kokiParser.parse(raw);
                });
                _this.containedKokisReceived.raise({ id: { root: false, id: id }, kokis: kokis });
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
