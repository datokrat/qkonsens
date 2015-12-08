var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function (require, exports) {
    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
    var KokiItem = (function () {
        function KokiItem() {
        }
        return KokiItem;
    })();
    exports.KokiItem = KokiItem;
    var QueryableItemCollectionBase = (function () {
        function QueryableItemCollectionBase() {
        }
        return QueryableItemCollectionBase;
    })();
    exports.QueryableItemCollectionBase = QueryableItemCollectionBase;
    var QueryableItemCollection = (function () {
        function QueryableItemCollection() {
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
});
