var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'frontendtests/reloader', 'windows/browse', '../topic'], function(require, exports, unit, reloader, Win, Topic) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.test = function (cxt, r) {
            var win = new Win.Win();
            win.parentTopic = ko.observable(new Topic.ParentViewModel());
            win.parentTopic().caption = ko.observable('Topic 1');
            win.parentTopic().description = ko.observable('Description');
            win.parentTopic().children = ko.observableArray([]);

            reloader.viewModel().right.win(win);
            r();
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
