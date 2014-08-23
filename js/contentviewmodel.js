var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;

    var WithContext = (function (_super) {
        __extends(WithContext, _super);
        function WithContext() {
            _super.apply(this, arguments);
        }
        return WithContext;
    })(ViewModel);
    exports.WithContext = WithContext;
});
