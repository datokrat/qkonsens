define(["require", "exports", '../locationhash', 'factories/konsenskistecontroller', '../konsenskisteviewmodel'], function(require, exports, LocationHash, KokiControllerFactory, kokiVm) {
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
                var typedState = state;
                var kk = _this.communicator.query(typedState.kokiId);
                _this.setKonsenskisteModel(kk);
            };
            this.window.state.subscribe(function (state) {
                LocationHash.set(JSON.stringify(state), false);
            });
            this.subscriptions = this.subscriptions.concat([
                LocationHash.changed.subscribe(function () {
                    _this.onHashChanged();
                })
            ]);
        };

        Controller.prototype.onHashChanged = function () {
            var hash = location.hash;
            var hashObj = JSON.parse(hash.slice(1));
            if (hashObj.kokId != (this.konsenskisteModel && this.konsenskisteModel.id()))
                this.setKonsenskisteModelById(hashObj.kokiId);
        };

        Controller.prototype.setKonsenskisteModelById = function (id) {
            this.cxt.konsenskisteModel(this.communicator.query(id));
        };

        Controller.prototype.initKonsenskiste = function (konsenskisteModel) {
            this.disposeKonsenskiste();

            var konsenskisteViewModel = new kokiVm.ViewModel;
            this.konsenskisteModel = konsenskisteModel;
            this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.communicator);
            if (this.cxt)
                this.konsenskisteController.setViewModelContext(this.cxt);

            this.window.kkView(konsenskisteViewModel);
            this.window.state({ kokiId: konsenskisteModel && konsenskisteModel.id() });
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
