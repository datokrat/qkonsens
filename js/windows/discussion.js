var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../frame'], function(require, exports, Frame) {
    var Win = (function (_super) {
        __extends(Win, _super);
        function Win() {
            _super.call(this, 'discussion-win-template', null);
            this.discussable = ko.observable();
            this.state('ok');
        }
        return Win;
    })(Frame.Win);
    exports.Win = Win;
});
