define(["require", "exports", 'event', 'topic', 'topicnavigationmodel', 'konsenskistecommunicatorimpl', 'discocontext'], function(require, exports, Evt, Topic, TopicNavigation, KokiCommunicator, discoContext) {
    var Main = (function () {
        function Main() {
            this.childrenReceived = new Evt.EventImpl();
            this.containedKokisReceived = new Evt.EventImpl();
            this.topicParser = new Parser();
            this.kokiParser = new KokiCommunicator.Parser();
        }
        Main.prototype.queryChildren = function (id, out) {
            var _this = this;
            var out = out || new TopicNavigation.Children();
            out.queryState().loading(true);

            var then = function (rawChildren) {
                var children = rawChildren.map(function (raw) {
                    return _this.topicParser.parseTopic(raw);
                });
                _this.childrenReceived.raise({ id: id, children: children });

                out.items.set(children);
                out.queryState().loading(false);
            };

            var fail = function (err) {
                out.queryState().error(err);
            };

            if (id.root)
                this.queryRootChildren(then, fail);
            else
                this.queryNonRootChildren(id.id, then, fail);
        };

        Main.prototype.queryRootChildren = function (then, fail) {
            var parentlessFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name != 'Child';
            });

            discoContext.Posts.filter(function (it) {
                return it.PostType.Description.Name == 'Topic' && it.RefersTo.every(this.parentlessFilter);
            }, { parentlessFilter: parentlessFilter }).include('Content').toArray().then(then).fail(fail);
        };

        Main.prototype.queryNonRootChildren = function (id, then, fail) {
            var childFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name == 'Child' && it.ReferreeId == this.Id;
            }, { Id: id });

            discoContext.Posts.filter(function (it) {
                return it.PostType.Description.Name == 'Topic' && it.RefersTo.some(this.childFilter);
            }, { childFilter: childFilter }).include('Content').toArray().then(then).fail(fail);
        };

        Main.prototype.queryContainedKokis = function (id, out) {
            var _this = this;
            var out = out || new TopicNavigation.Kokis();
            out.queryState().loading(true);

            var then = function (rawKokis) {
                var kokis = rawKokis.map(function (raw) {
                    return _this.kokiParser.parse(raw);
                });
                _this.containedKokisReceived.raise({ id: id, kokis: kokis });

                out.items.set(kokis);
                out.queryState().loading(false);
            };

            var fail = function (err) {
                return out.queryState().error(err);
            };

            if (!id.root)
                this.queryContainedKokisOfNonRoot(id.id, then, fail);
            else
                then([]);
        };

        Main.prototype.queryContainedKokisOfNonRoot = function (id, then, fail) {
            var dependenceFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferreeId == this.Id;
            }, { Id: id });
            var kaRefFilter = discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name == 'Part';
            });

            discoContext.Posts.filter(function (it) {
                return it.RefersTo.some(this.dependenceFilter) && it.ReferredFrom.some(this.kaRefFilter);
            }, { dependenceFilter: dependenceFilter, kaRefFilter: kaRefFilter }).include('Content').toArray().then(then);
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
