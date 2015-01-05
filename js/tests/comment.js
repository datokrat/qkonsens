var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../comment', '../rating', 'tests/testratingcommunicator', 'tests/testdiscussioncommunicator'], function(require, exports, unit, test, common, Comment, Rating, RatingCommunicator, DiscussionCommunicator) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.apply(this, arguments);
        }
        Main.prototype.test = function () {
            var counter = new common.Counter();
            var model = new Comment.Model();
            var viewModel = new Comment.ViewModel();
            var communicator = new DiscussionCommunicator();
            communicator.rating = new RatingCommunicator.Stub();
            var controller = new Comment.Controller(model, viewModel, communicator);

            communicator.rating.submitLikeRating = function (ratableId, rating, then) {
                test.assert(function (v) {
                    return v.val(rating) == 'like';
                });
                then();
            };

            controller.commandProcessor.processCommand(new Rating.SelectLikeRatingCommand('like', function () {
                counter.inc('command');
            }));

            test.assert(function (v) {
                return v.val(counter.get('command')) == 1;
            });
        };
        return Main;
    })(unit.TestClass);
    exports.Main = Main;
});
