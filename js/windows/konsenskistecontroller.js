define(["require", "exports", 'factories/konsenskistecontroller', '../konsenskisteviewmodel'], function(require, exports, KokiControllerFactory, kokiVm) {
    var Controller = (function () {
        function Controller(konsenskisteModel, windowViewModel, communicator) {
            this.konsenskisteControllerFactory = new KokiControllerFactory.Factory;
            this.window = windowViewModel;
            this.communicator = communicator;
            this.window.kkView = ko.observable();
            this.initKonsenskiste(konsenskisteModel);
        }
        Controller.prototype.initKonsenskiste = function (konsenskisteModel) {
            if (this.konsenskisteController)
                this.konsenskisteController.dispose();

            var konsenskisteViewModel = new kokiVm.ViewModel;
            this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.communicator);
            if (this.cxt)
                this.konsenskisteController.setContext(this.cxt);

            this.window.kkView(konsenskisteViewModel);
        };

        Controller.prototype.setContext = function (cxt) {
            console.log('windows/konsenskistecontroller.setContext');
            this.cxt = cxt;
            this.konsenskisteController.setContext(cxt);
            return this;
        };

        Controller.prototype.setKonsenskisteModel = function (konsenskisteModel) {
            this.initKonsenskiste(konsenskisteModel);
            this.setContext(this.cxt);
        };

        Controller.prototype.dispose = function () {
            this.konsenskisteController.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
