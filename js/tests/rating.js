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
            /*var serverRatableModel = { id: ko.observable(2), rating: ko.observable(new Rating.Model) };
            ctr.setRatableModel({ id: ko.observable(2), rating: ko.observable(mdl) });
            
            var submissionCtr = 0, errorCtr = 0;
            com.ratingSubmitted.subscribe(() => ++submissionCtr);
            com.submissionFailed.subscribe(() => ++errorCtr);
            
            com.setTestRatable(serverRatableModel);
            
            vm.select('like')();
            
            setTimeout(() => {
            try {
            test.assert(() => submissionCtr == 1);
            test.assert(() => errorCtr == 0);
            test.assert(() => serverRatableModel.rating().personalRating() == 'like');
            r();
            }
            catch(e) {
            r(e);
            }
            }, 100);*/
        };

        /*queryRating() {
        var mdl = new Rating.Model();
        var vm = new Rating.ViewModel();
        var com = new RatingCommunicator.Main();
        var ctr = new Rating.Controller(mdl, vm, { communicator: com, commandProcessor: null });
        ctr.setRatableModel({ id: ko.observable(2), rating: ko.observable(mdl) });
        
        var successCtr = 0;
        
        var serverRatableModel = { id: ko.observable(2), rating: ko.observable(new Rating.Model) };
        serverRatableModel.rating().personalRating('stronglike');
        com.setTestRatable(serverRatableModel);
        com.ratingReceived.subscribe(args => {
        ++successCtr;
        test.assert(() => args.ratableId == 2);
        test.assert(() => args.rating.personalRating() == 'stronglike');
        });
        
        com.queryRating(2);
        
        test.assert(() => successCtr == 1);
        test.assert(() => mdl.personalRating() == 'stronglike');
        }*/
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
