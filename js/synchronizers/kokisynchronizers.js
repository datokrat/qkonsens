var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'synchronizers/childarraysynchronizer', 'factories/constructorbased', '../kernaussageviewmodel', '../kernaussagecontroller'], function(require, exports, Base, Factories, KaViewModel, KaController) {
    var KaSynchronizer = (function (_super) {
        __extends(KaSynchronizer, _super);
        function KaSynchronizer(communicator) {
            _super.call(this);
            this.controllerFactory2 = new ControllerFactory().setCommunicator(communicator);
            this.setViewModelFactory(new Factories.Factory(KaViewModel.ViewModel));
            this.setControllerFactory(this.controllerFactory2);
        }
        KaSynchronizer.prototype.setViewModelContext = function (cxt) {
            this.controllerFactory2.setViewModelContext(cxt);
            this.forEachController(function (ctr) {
                return ctr.setViewModelContext(cxt);
            });
        };
        return KaSynchronizer;
    })(Base.ObservingChildArraySynchronizer);
    exports.KaSynchronizer = KaSynchronizer;

    var ControllerFactory = (function () {
        function ControllerFactory() {
        }
        ControllerFactory.prototype.create = function (model, viewModel) {
            var controller = new KaController.Controller(model, viewModel, this.communicator);
            if (this.viewModelContext)
                controller.setViewModelContext(this.viewModelContext);
            return controller;
        };

        ControllerFactory.prototype.setViewModelContext = function (cxt) {
            this.viewModelContext = cxt;
            return this;
        };

        ControllerFactory.prototype.setCommunicator = function (com) {
            this.communicator = com;
            return this;
        };
        return ControllerFactory;
    })();
});
