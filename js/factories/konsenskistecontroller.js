define(["require", "exports", '../konsenskistecontroller'], function(require, exports, ctr) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (model, viewModel, args) {
            if (model)
                return new ctr.ControllerImpl(model, viewModel, args);
            else
                return new NullController();
        };
        return Factory;
    })();
    exports.Factory = Factory;

    var NullController = (function () {
        function NullController() {
        }
        NullController.prototype.dispose = function () {
        };
        NullController.prototype.setViewModelContext = function () {
        };
        return NullController;
    })();
});
