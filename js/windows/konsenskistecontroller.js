define(["require", "exports", 'factories/konsenskistecontroller', '../konsenskisteviewmodel'], function(require, exports, KokiControllerFactory, kokiVm) {
    var Controller = (function () {
        function Controller(konsenskisteModel, windowViewModel, communicator) {
            this.konsenskisteControllerFactory = new KokiControllerFactory.Factory;
            this.subscriptions = [];
            this.initWindow(windowViewModel);
            this.communicator = communicator;
            this.window.kkView = ko.observable();
            this.initKonsenskiste(konsenskisteModel);
        }
        Controller.prototype.initWindow = function (win) {
            var _this = this;
            this.window = win;
            this.window.setState = function (state) {
                if (state) {
                    var typedState = state;
                    var kk = _this.communicator.query(typedState.kokiId);
                    _this.setKonsenskisteModel(kk);
                }
            };
        };

        Controller.prototype.setKonsenskisteModelById = function (id) {
            this.cxt.konsenskisteModel(this.communicator.query(id));
        };

        Controller.prototype.initKonsenskiste = function (konsenskisteModel) {
            console.log('initKonsenskiste', konsenskisteModel);
            this.disposeKonsenskiste();

            var konsenskisteViewModel = new kokiVm.ViewModel;
            this.konsenskisteModel = konsenskisteModel;
            this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.communicator);
            if (this.cxt)
                this.konsenskisteController.setViewModelContext(this.cxt);

            this.window.kkView(konsenskisteViewModel);
            this.window.state((konsenskisteModel && konsenskisteModel.id()) ? { kokiId: konsenskisteModel.id() } : null);
        };

        Controller.prototype.disposeKonsenskiste = function () {
            if (this.konsenskisteController)
                this.konsenskisteController.dispose();
        };

        Controller.prototype.setContext = function (cxt) {
            this.cxt = cxt;
            this.konsenskisteController.setViewModelContext(cxt);
            return this;
        };

        Controller.prototype.setKonsenskisteModel = function (konsenskisteModel) {
            this.initKonsenskiste(konsenskisteModel);
            this.setContext(this.cxt);
        };

        Controller.prototype.dispose = function () {
            this.konsenskisteController.dispose();
            this.subscriptions.forEach(function (s) {
                return s.undo();
            });
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
