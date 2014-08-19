///<reference path="array.ts" />
define(["require", "exports"], function(require, exports) {
    

    var EventImpl = (function () {
        function EventImpl() {
            this.listeners = [];
        }
        EventImpl.prototype.subscribe = function (cb) {
            if (!this.isListener(cb))
                this.listeners.push(cb);
        };

        EventImpl.prototype.unsubscribe = function (cb) {
            if (this.isListener(cb))
                this.listeners.removeOne(cb);
        };

        EventImpl.prototype.raise = function (args) {
            this.listeners.forEach(function (l) {
                l(args);
            });
        };

        EventImpl.prototype.isListener = function (cb) {
            return this.listeners.indexOf(cb) != -1;
        };
        return EventImpl;
    })();
    exports.EventImpl = EventImpl;
});
