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
            this.setViewModelFactory(new Factories.Factory(KaViewModel.ViewModel));
            this.setControllerFactory(new Factories.ControllerFactoryEx(KaController.Controller, communicator));
        }
        return KaSynchronizer;
    })(Base.ObservingChildArraySynchronizer);
    exports.KaSynchronizer = KaSynchronizer;
});
