define(["require", "exports", 'controller'], function(require, exports, MainController) {
    var Model = (function () {
        function Model() {
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
                controllerArgs.commandProcessor.processCommand(new MainController.OpenEnvironsWindowCommand());
            };
        }
        Controller.prototype.dispose = function () {
            this.viewModel.environsClick = function () {
            };
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
