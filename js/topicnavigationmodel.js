define(["require", "exports", 'event', 'observable'], function(require, exports, Evt, Obs) {
    var ParentTopicArray = (function () {
        function ParentTopicArray() {
            this.pushed = new Evt.EventImpl();
            this.removed = new Evt.EventImpl();
            this.changed = new Evt.EventImpl();
            this.historySubscriptions = [];
        }
        ParentTopicArray.prototype.get = function (index) {
            if (arguments.length < 1)
                return this.history.get().slice(0, -1);
            else if (index < 0)
                return this.history.get(index - 1);
            else if (index < this.history.get().length - 1)
                return this.history.get(index);
            else
                return undefined;
        };

        ParentTopicArray.prototype.setHistory = function (history) {
            this.history = history;
            this.initHistory();
            this.changed.raise(this.get());
        };

        ParentTopicArray.prototype.initHistory = function () {
            var _this = this;
            this.disposeHistory();
            this.last = this.history.get(-1);
            this.historySubscriptions = [
                this.history.pushed.subscribe(function (item) {
                    _this.last = item;
                    if (_this.history.get().length > 1)
                        _this.pushed.raise(_this.get(-1));
                }),
                this.history.removed.subscribe(function (item) {
                    if (_this.history.get().length == 0)
                        return;
                    else if (_this.last == item)
                        _this.removed.raise(_this.last = _this.history.get(-1));
                    else
                        _this.removed.raise(item);
                }),
                this.history.changed.subscribe(function () {
                    _this.last = _this.history.get(-1);
                    _this.changed.raise(_this.get());
                })
            ];
        };

        ParentTopicArray.prototype.disposeHistory = function () {
            this.historySubscriptions.forEach(function (s) {
                return s.dispose();
            });
            this.historySubscriptions = [];
        };

        ParentTopicArray.prototype.dispose = function () {
            this.disposeHistory();
        };
        return ParentTopicArray;
    })();
    exports.ParentTopicArray = ParentTopicArray;

    var ModelImpl = (function () {
        function ModelImpl() {
            var _this = this;
            this.history = new Obs.ObservableArrayExtender(ko.observableArray());
            this.selectedTopic = ko.computed(function () {
                return _this.history && _this.history.get(-1);
            });
            this.children = new Obs.ObservableArrayExtender(ko.observableArray());
            this.kokis = new Obs.ObservableArrayExtender(ko.observableArray());
        }
        ModelImpl.prototype.goBackToBreadcrumbTopic = function (index) {
            this.history.removeMany(index + 1);
        };

        ModelImpl.prototype.selectChild = function (child) {
            this.children.set([]);
            this.history.push(child);
        };

        ModelImpl.prototype.selectTopicFromHistory = function (topic) {
            this.children.set([]);
            this.goBackToBreadcrumbTopic(this.history.get().indexOf(topic));
        };
        return ModelImpl;
    })();
    exports.ModelImpl = ModelImpl;
});
