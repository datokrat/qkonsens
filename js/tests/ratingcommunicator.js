var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', 'tests/testratingcommunicator', '../rating'], function(require, exports, unit, test, TestRatingCommunicator, Rating) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.rateNonexistentRatable = function () {
            var com = new TestRatingCommunicator.Main();
            var ctr = 0;

            com.submissionFailed.subscribe(function (args) {
                test.assert(function () {
                    return args.ratableId == 2;
                });
                ++ctr;
            });

            com.submitRating(2, 'stronglike');
            test.assert(function () {
                return ctr == 1;
            });
        };

        TestClass.prototype.submitRatingAndReceiveNewValue = function () {
            var ctr = 0;
            var com = new TestRatingCommunicator.Main();
            com.setTestRatable({ id: ko.observable(2), rating: ko.observable(new Rating.Model) });

            com.ratingSubmitted.subscribe(function (args) {
                test.assert(function () {
                    return args.ratableId == 2;
                });
                test.assert(function () {
                    return args.rating == 'stronglike';
                });
                ++ctr;
            });
            com.submitRating(2, 'stronglike');

            test.assert(function () {
                return ctr == 1;
            });
        };

        TestClass.prototype.queryRating = function () {
            var ctr = 0;
            var com = new TestRatingCommunicator.Main();
            var rating = new Rating.Model();
            rating.personalRating('like');
            com.setTestRatable({ id: ko.observable(10), rating: ko.observable(rating) });

            com.ratingReceived.subscribe(function (args) {
                ++ctr;
                test.assert(function () {
                    return args.ratableId == 10;
                });
                test.assert(function () {
                    return args.rating.personalRating() == 'like';
                });
            });

            com.queryRating(10);

            test.assert(function () {
                return ctr == 1;
            });
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
