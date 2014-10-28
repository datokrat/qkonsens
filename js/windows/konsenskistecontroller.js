define(["require", "exports", 'factories/konsenskistecontroller', '../konsenskisteviewmodel'], function(require, exports, KokiControllerFactory, kokiVm) {
    var Controller = (function () {
        function Controller(konsenskisteModel, windowViewModel, communicator) {
            this.konsenskisteControllerFactory = new KokiControllerFactory.Factory;
            this.initWindow(windowViewModel);
            this.communicator = communicator;
            this.window.kkView = ko.observable();
            this.initKonsenskiste(konsenskisteModel);
        }
        Controller.prototype.initWindow = function (win) {
            var _this = this;
            this.window = win;
            this.window.setState = function (state) {
                var typedState = state;
                var kk = _this.communicator.queryKoki(typedState.kokiId);
                _this.setKonsenskisteModel(kk);
            };
        };

        Controller.prototype.initKonsenskiste = function (konsenskisteModel) {
            this.disposeKonsenskiste();

            var konsenskisteViewModel = new kokiVm.ViewModel;
            this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.communicator);
            if (this.cxt)
                this.konsenskisteController.setContext(this.cxt);

            this.window.kkView(konsenskisteViewModel);
            this.window.state({ kokiId: konsenskisteModel && konsenskisteModel.id() });
        };

        Controller.prototype.disposeKonsenskiste = function () {
            if (this.konsenskisteController)
                this.konsenskisteController.dispose();
        };

        Controller.prototype.setContext = function (cxt) {
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
