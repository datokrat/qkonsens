var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'kelement'], function(require, exports, KElement) {
    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel() {
            _super.apply(this, arguments);
        }
        return ViewModel;
    })(KElement.ViewModel);
    exports.ViewModel = ViewModel;
});
