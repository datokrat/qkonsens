define(["require", "exports", 'tests/test', '../common', '../kelement', '../command', '../rating', 'tests/testkonsenskistecommunicator', '../kelementcommands'], function(require, exports, test, common, KElement, Commands, Rating, KokiCommunicator, KElementCommands) {
    var Main = (function () {
        function Main() {
        }
        Main.prototype.processSubmitRatingCommand = function () {
            var counter = new common.Counter();
            var kModel = new KElement.Model();
            kModel.id(6);
            var kViewModel = new KElement.ViewModel();
            var kCommunicator = new KokiCommunicator.Stub();
            var kController = new KElement.Controller(kModel, kViewModel, kCommunicator, null);

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

        Main.prototype.edit = function () {
            var counter = new common.Counter();
            var kModel = new KElement.Model();
            kModel.id(6);
            var kViewModel = new KElement.ViewModel();
            var kCommunicator = new KokiCommunicator.Stub();
            var commandProcessor = new Commands.CommandProcessor();
            var kController = new KElement.Controller(kModel, kViewModel, kCommunicator, commandProcessor);

            commandProcessor.chain.insertAtBeginning(function (cmd) {
                if (cmd instanceof KElementCommands.OpenEditKElementWindowCommand) {
                    counter.inc('cmd');
                    test.assert(function (v) {
                        return v.val(cmd.model.id()) == 6;
                    });
                    return true;
                }
                return false;
            });

            kViewModel.editClick();

            test.assert(function (v) {
                return v.val(counter.get('cmd')) == 1;
            });
        };
        return Main;
    })();
    exports.Main = Main;
});
