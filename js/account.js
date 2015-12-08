define(["require", "exports"], function (require, exports) {
    var Model = (function () {
        function Model(args) {
            if (args === void 0) { args = { userName: 'anonymous' }; }
            this.userName = args.userName;
        }
        Model.prototype.eq = function (other) {
            return other.userName == this.userName;
        };
        return Model;
    })();
    exports.Model = Model;
    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
