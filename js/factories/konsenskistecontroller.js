define(["require", "exports", '../konsenskistecontroller'], function(require, exports, ctr) {
    var Factory = (function () {
        function Factory() {
        }
        Factory.prototype.create = function (model, viewModel, communicator) {
            if (model)
                return new ctr.ControllerImpl(model, viewModel, communicator);
            else
                return new ctr.NullController(viewModel);
        };
        return Factory;
    })();
    exports.Factory = Factory;
});
