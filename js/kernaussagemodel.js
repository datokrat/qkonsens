var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'kelement'], function (require, exports, KElement) {
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model() {
            _super.apply(this, arguments);
        }
        Model.prototype.set = function (other) {
            KElement.Model.prototype.set.apply(this, arguments);
        };
        return Model;
    })(KElement.Model);
    exports.Model = Model;
});
