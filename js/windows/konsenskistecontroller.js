define(["require", "exports", 'factories/konsenskistecontroller', '../konsenskisteviewmodel'], function(require, exports, KokiControllerFactory, kokiVm) {
    var Controller = (function () {
        function Controller(konsenskisteModel, windowViewModel) {
            this.konsenskisteControllerFactory = new KokiControllerFactory.Factory;
            this.window = windowViewModel;
            this.window.kkView = ko.observable();
            this.initKonsenskiste(konsenskisteModel);
        }
        Controller.prototype.initKonsenskiste = function (konsenskisteModel) {
            if (this.konsenskisteController)
                this.konsenskisteController.dispose();

            var konsenskisteViewModel = new kokiVm.ViewModel;
            this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel);

            this.window.kkView(konsenskisteViewModel);
        };

        Controller.prototype.setKonsenskisteModel = function (konsenskisteModel) {
            this.initKonsenskiste(konsenskisteModel);
        };

        Controller.prototype.dispose = function () {
            this.konsenskisteController.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
