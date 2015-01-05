var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', '../comment', 'tests/testdiscussioncommunicator'], function(require, exports, unit, Comment, DiscussionCommunicator) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.apply(this, arguments);
        }
        Main.prototype.test = function () {
            var model = new Comment.Model();
            var viewModel = new Comment.ViewModel();
            var communicator = new DiscussionCommunicator();
        };
        return Main;
    })(unit.TestClass);
    exports.Main = Main;
});
