var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../observable', '../comment', '../contentcommunicatorimpl', 'synchronizers/comment'], function(require, exports, unit, test, Obs, Comment, ContentCommunicatorImpl, CommentSynchronizer) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.test = function () {
            var models = new Obs.ObservableArrayExtender(ko.observableArray());
            var insertionCtr = 0;
            var inserted = function (viewModel) {
                test.assert(function () {
                    return insertionCtr++ == 0;
                });
            };

            var sync = new CommentSynchronizer(new ContentCommunicatorImpl).setViewModelInsertionHandler(inserted).setModelObservable(models);

            models.push(new Comment.Model);

            test.assert(function () {
                return insertionCtr == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
