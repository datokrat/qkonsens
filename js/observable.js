define(["require", "exports", 'event'], function(require, exports, Events) {
    var ObservableArrayExtender = (function () {
        function ObservableArrayExtender(innerObservable) {
            this.pushed = new Events.EventImpl();
            this.removed = new Events.EventImpl();
            this.changed = new Events.EventImpl();
            this.innerObservable = innerObservable;
        }
        ObservableArrayExtender.prototype.get = function () {
            return this.innerObservable();
        };

        ObservableArrayExtender.prototype.set = function (value) {
            var old = this.innerObservable();
            this.innerObservable(value);
            this.changed.raise(old);
        };

        ObservableArrayExtender.prototype.push = function (item) {
            this.innerObservable.push(item);
            this.pushed.raise(item);
        };

        ObservableArrayExtender.prototype.remove = function (item) {
            this.innerObservable.remove(item);
            this.removed.raise(item);
        };

        ObservableArrayExtender.prototype.subscribe = function (handler) {
            return this.innerObservable.subscribe(handler);
        };

        ObservableArrayExtender.prototype.dispose = function () {
            this.innerObservable.dispose();
        };
        return ObservableArrayExtender;
    })();
    exports.ObservableArrayExtender = ObservableArrayExtender;
});
