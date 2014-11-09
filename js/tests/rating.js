var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', '../rating', 'tests/testratingcommunicator'], function(require, exports, unit, test, Rating, RatingCommunicator) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.submitRating = function (cxt, r) {
            var mdl = new Rating.Model();
            var vm = new Rating.ViewModel();
            var com = new RatingCommunicator.Main();
            var ctr = new Rating.Controller(mdl, vm, com);
            var serverRatableModel = { id: ko.observable(2), rating: ko.observable(new Rating.Model) };
            ctr.setRatableModel({ id: ko.observable(2), rating: ko.observable(mdl) });

            var submissionCtr = 0, errorCtr = 0;
            com.ratingSubmitted.subscribe(function () {
                return ++submissionCtr;
            });
            com.submissionFailed.subscribe(function () {
                return ++errorCtr;
            });

            com.setTestRatable(serverRatableModel);

            vm.select('like')();

            setTimeout(function () {
                try  {
                    test.assert(function () {
                        return submissionCtr == 1;
                    });
                    test.assert(function () {
                        return errorCtr == 0;
                    });
                    test.assert(function () {
                        return serverRatableModel.rating().personalRating() == 'like';
                    });
                    r();
                } catch (e) {
                    r(e);
                }
            }, 100);
        };

        TestClass.prototype.queryRating = function (cxt, r) {
            var mdl = new Rating.Model();
            var vm = new Rating.ViewModel();
            var com = new RatingCommunicator.Main();
            var ctr = new Rating.Controller(mdl, vm, com);
            ctr.setRatableModel({ id: ko.observable(2), rating: ko.observable(mdl) });

            var successCtr = 0;

            var serverRatableModel = { id: ko.observable(2), rating: ko.observable(new Rating.Model) };
            serverRatableModel.rating().personalRating('stronglike');
            com.setTestRatable(serverRatableModel);
            com.ratingReceived.subscribe(function (args) {
                ++successCtr;
                test.assert(function () {
                    return args.ratableId == 2;
                });
                test.assert(function () {
                    return args.rating.personalRating() == 'stronglike';
                });
            });

            com.queryRating(2);

            test.assert(function () {
                return successCtr == 1;
            });
            test.assert(function () {
                return mdl.personalRating() == 'stronglike';
            });
            r();
        };
        return TestClass;
    })(unit.TestClass);
    exports.TestClass = TestClass;
});
