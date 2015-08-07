define(["require", "exports", 'windows'], function(require, exports, Windows) {
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
                controllerArgs.commandProcessor.processCommand(new Windows.OpenEnvironsWindowCommand());
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
