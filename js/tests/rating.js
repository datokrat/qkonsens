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
        TestClass.prototype.submitRating = function (async, r) {
            async();
            var counter = new common.Counter();
            var mdl = new Rating.Model();
            var vm = new Rating.ViewModel();
            var com = new RatingCommunicator.Main();
            var commandProcessor = new Commands.CommandProcessor();
            var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: commandProcessor });

            commandProcessor.chain.append(function (cmd) {
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
            });

            vm.select('like')();

            setTimeout(function () {
                test.assert(function () {
                    return counter.get('command') == 1;
                });
                r();
            });
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
