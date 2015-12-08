define(["require", "exports", 'windows', 'kokilogic'], function (require, exports, Windows, KokiLogic) {
    var Model = (function () {
        function Model() {
            this.text = ko.observable();
        }
        return Model;
    })();
    exports.Model = Model;
    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
    var Controller = (function () {
        function Controller(model, viewModel, controllerArgs) {
            this.model = model;
            this.viewModel = viewModel;
            this.controllerArgs = controllerArgs;
            viewModel.environsClick = function () {
                controllerArgs.commandProcessor.processCommand(new Windows.OpenEnvironsWindowCommand());
                controllerArgs.commandProcessor.processCommand(new KokiLogic.LoadEnvironsCommand(model.parentID, function (model) {
                    alert(model.text());
                }));
            };
        }
        Controller.prototype.dispose = function () {
            this.viewModel.environsClick = function () { };
        };
        return Controller;
    })();
    exports.Controller = Controller;
    var Communicator = (function () {
        function Communicator() {
        }
        Communicator.prototype.loadEnvirons = function (kElementID, success) {
            var model = new Model;
            model.text("Wir freuen uns.");
            success(model);
        };
        return Communicator;
    })();
    exports.Communicator = Communicator;
});
