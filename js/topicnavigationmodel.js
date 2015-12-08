var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'observable', 'querystate'], function (require, exports, Obs, QueryState) {
    var ModelImpl = (function () {
        function ModelImpl() {
            var _this = this;
            this.history = new Obs.ObservableArrayExtender(ko.observableArray());
            this.selectedTopic = ko.computed(function () { return _this.history && _this.history.get(-1); });
            this.children = new Children();
            this.kokis = new Kokis();
        }
        ModelImpl.prototype.goBackToBreadcrumbTopic = function (index) {
            this.history.removeMany(index + 1);
        };
        ModelImpl.prototype.selectChild = function (child) {
            this.children.items.set([]);
            this.history.push(child);
        };
        ModelImpl.prototype.selectTopicFromHistory = function (topic) {
            this.children.items.set([]);
            this.goBackToBreadcrumbTopic(this.history.get().indexOf(topic));
        };
        return ModelImpl;
    })();
    exports.ModelImpl = ModelImpl;
    var QueryableItemCollectionBase = (function () {
        function QueryableItemCollectionBase() {
        }
        return QueryableItemCollectionBase;
    })();
    exports.QueryableItemCollectionBase = QueryableItemCollectionBase;
    var QueryableItemCollection = (function () {
        function QueryableItemCollection() {
            this.items = new Obs.ObservableArrayExtender(ko.observableArray());
            this.queryState = ko.observable(new QueryState.QueryState);
        }
        return QueryableItemCollection;
    })();
    exports.QueryableItemCollection = QueryableItemCollection;
    var Kokis = (function (_super) {
        __extends(Kokis, _super);
        function Kokis() {
            _super.apply(this, arguments);
        }
        return Kokis;
    })(QueryableItemCollection);
    exports.Kokis = Kokis;
    var Children = (function (_super) {
        __extends(Children, _super);
        function Children() {
            _super.apply(this, arguments);
        }
        return Children;
    })(QueryableItemCollection);
    exports.Children = Children;
    ;
});
