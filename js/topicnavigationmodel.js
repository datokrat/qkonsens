var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'observable'], function(require, exports, Obs) {
    var ModelImpl = (function () {
        function ModelImpl() {
            var _this = this;
            this.history = new Obs.ObservableArrayExtender(ko.observableArray());
            this.selectedTopic = ko.computed(function () {
                return _this.history && _this.history.get(-1);
            });
            this.children = new ChildrenModel();
            this.kokis = new KokisModel();
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

    var QueryableItemCollection = (function () {
        function QueryableItemCollection() {
            this.items = new Obs.ObservableArrayExtender(ko.observableArray());
        }
        return QueryableItemCollection;
    })();
    exports.QueryableItemCollection = QueryableItemCollection;

    var KokisModel = (function (_super) {
        __extends(KokisModel, _super);
        function KokisModel() {
            _super.apply(this, arguments);
        }
        return KokisModel;
    })(QueryableItemCollection);
    exports.KokisModel = KokisModel;
    var ChildrenModel = (function (_super) {
        __extends(ChildrenModel, _super);
        function ChildrenModel() {
            _super.apply(this, arguments);
        }
        return ChildrenModel;
    })(QueryableItemCollection);
    exports.ChildrenModel = ChildrenModel;
    ;
});
