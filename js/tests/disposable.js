var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', '../event'], function(require, exports, unit, Event) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests(factory) {
            _super.call(this);
            this.eventFactory = new TestEventFactory();
            this.factory = factory;
            this.factory.setEventFactory(this.eventFactory);
        }
        Tests.prototype.test = function () {
            this.eventFactory.reset();
            var disposable = this.factory.create();
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var TestEvent = (function () {
        function TestEvent() {
            this.event = new Event.EventImpl();
            this.listenerCtr = 0;
            this.raiseThis = this.raise.bind(this);
        }
        TestEvent.prototype.subscribe = function (cb) {
            var _this = this;
            this.listenerCtr++;
            this.event.subscribe(cb);
            return { dispose: function () {
                    return _this.unsubscribe(cb);
                } };
        };

        TestEvent.prototype.subscribeUntil = function (cb, timeout) {
            var subscription;
            var handler = function (args) {
                if (cb(args))
                    subscription.dispose();
            };
            subscription = this.subscribe(handler);
            if (typeof timeout === 'number')
                setTimeout(function () {
                    return subscription.dispose();
                }, timeout);
            return subscription;
        };

        TestEvent.prototype.unsubscribe = function (cb) {
            this.listenerCtr--;
            this.event.unsubscribe(cb);
        };

        TestEvent.prototype.raise = function (args) {
            this.event.raise(args);
        };

        TestEvent.prototype.clear = function () {
            this.event.clear();
        };

        TestEvent.prototype.countListeners = function () {
            return this.listenerCtr;
        };
        return TestEvent;
    })();

    var TestEventFactory = (function () {
        function TestEventFactory() {
            this.allEvents = [];
        }
        TestEventFactory.prototype.create = function () {
            var ret = new TestEvent();
            this.allEvents.push(ret);

            return ret;
        };

        TestEventFactory.prototype.reset = function () {
            this.allEvents = [];
        };
        return TestEventFactory;
    })();
});
