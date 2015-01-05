var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', '../common', '../command', '../rating', 'tests/testratingcommunicator'], function(require, exports, unit, test, common, Commands, Rating, RatingCommunicator) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.submitRating = function (async, r, cb) {
            async();
            var counter = new common.Counter();
            var mdl = new Rating.Model();
            var vm = new Rating.ViewModel();
            var com = new RatingCommunicator.Main();
            var commandProcessor = new Commands.CommandProcessor();
            var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: commandProcessor });

            commandProcessor.chain.append(cb(function (cmd) {
                counter.inc('command');
                test.assert(function () {
                    return cmd instanceof Rating.SelectRatingCommand;
                });

                var castCmd = cmd;
                test.assert(function () {
                    return castCmd.ratingValue == 'like';
                });

                castCmd.then();
                test.assert(function () {
                    return mdl.personalRating() == 'like';
                });
                return true;
            }));

            vm.select('like')();

            setTimeout(cb(function () {
                test.assert(function () {
                    return counter.get('command') == 1;
                });
                r();
            }));
        };

        TestClass.prototype.submitLikeRating = function (async, r, cb) {
            async();
            var counter = new common.Counter();
            var mdl = new Rating.LikeRatingModel();
            var vm = new Rating.LikeRatingViewModel();
            var commandProcessor = new Commands.CommandProcessor();
            var ctr = new Rating.LikeRatingController(mdl, vm, commandProcessor);

            commandProcessor.chain.append(cb(function (cmd) {
                counter.inc('command');
                test.assert(function (v) {
                    return cmd instanceof Rating.SelectLikeRatingCommand;
                });
                var typedCmd = cmd;
                test.assert(function (v) {
                    return typedCmd.ratingValue == 'dislike';
                });
                typedCmd.then && typedCmd.then();
                test.assert(function (v) {
                    return v.val(mdl.personalRating()) == 'dislike';
                });
                return true;
            }));
            vm.select('dislike')();
            setTimeout(cb(function () {
                test.assert(function () {
                    return counter.get('command') == 1;
                });
                r();
            }));
        };

        TestClass.prototype.summarizedRatingsMVSync = function () {
            var mdl = new Rating.Model();
            var vm = new Rating.ViewModel();
            var com = new RatingCommunicator.Main();
            var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: null });

            mdl.summarizedRatings().like(3);

            test.assert(function () {
                return vm.summarizedRatings().like() == 3;
            });
        };
        return TestClass;
    })(unit.TestClass);
    exports.TestClass = TestClass;
});
