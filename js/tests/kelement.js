define(["require", "exports", 'tests/test', '../common', '../kelement', '../rating', 'tests/testkonsenskistecommunicator'], function(require, exports, test, common, KElement, Rating, KokiCommunicator) {
    var Main = (function () {
        function Main() {
        }
        Main.prototype.processSubmitRatingCommand = function () {
            var counter = new common.Counter();
            var kModel = new KElement.Model();
            kModel.id(6);
            var kViewModel = new KElement.ViewModel();
            var kCommunicator = new KokiCommunicator.Stub();
            var kController = new KElement.Controller(kModel, kViewModel, kCommunicator);

            kCommunicator.rating.submitRating = function (ratableId, rating, then) {
                counter.inc('submitRating');
                test.assert(function () {
                    return ratableId == 6;
                });
                test.assert(function () {
                    return rating == 'stronglike';
                });
                test.assert(function () {
                    return counter.get('then') == 0;
                });
                then && then();
                test.assert(function () {
                    return counter.get('then') == 1;
                });
            };

            var cmd = new Rating.SelectRatingCommand('stronglike', function () {
                return counter.inc('then');
            });
            kController.commandProcessor.processCommand(cmd);

            test.assert(function () {
                return counter.get('submitRating') == 1;
            });
            test.assert(function () {
                return counter.get('then') == 1;
            });
        };
        return Main;
    })();
    exports.Main = Main;
});
