///<reference path="../../typings/knockout.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', '../topicnavigationmodel', '../topic'], function(require, exports, unit, mdl, tpc) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.factory = new Factory();
            this.topicFactory = new TopicFactory();
        }
        Tests.prototype.testSelectChildTopic = function () {
            var navi = this.factory.create();

            navi.history.push(this.topicFactory.create('root'));
            navi.history.push(this.topicFactory.create('child'));

            this.areIdentical(navi.selectedTopic().title(), 'child');
            this.areIdentical(navi.history.get().length, 2);
        };

        Tests.prototype.testGoBackToBreadcrumbTopic = function () {
            var navi = this.factory.create();
            navi.history.push(this.topicFactory.create('root'));
            navi.history.push(this.topicFactory.create('democracy'));

            navi.goBackToBreadcrumbTopic(0);

            this.areIdentical(navi.selectedTopic().title(), 'root');
            this.areIdentical(navi.history.get().length, 1);
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function () {
            return new mdl.ModelImpl();
        };
        return Factory;
    })();

    var TopicFactory = (function () {
        function TopicFactory() {
        }
        TopicFactory.prototype.create = function (title) {
            var topic = new tpc.Model();
            topic.title(title);
            return topic;
        };
        return TopicFactory;
    })();
});
