define(["require", "exports", 'factories/konsenskistecontroller', '../konsenskistemodel', '../konsenskisteviewmodel', '../kokilogic'], function (require, exports, KokiControllerFactory, kokiMdl, kokiVm, KokiLogic) {
    var ControllerImpl = (function () {
        function ControllerImpl(konsenskisteModel, windowViewModel, args) {
            this.args = args;
            this.konsenskisteControllerFactory = new KokiControllerFactory.Factory;
            this.subscriptions = [];
            this.initWindow(windowViewModel);
            this.communicator = args.communicator;
            this.initKonsenskiste(konsenskisteModel);
        }
        ControllerImpl.prototype.initWindow = function (win) {
            var _this = this;
            this.window = win;
            this.window.kkView = ko.observable();
            this.window.setState = function (state) {
                if (state) {
                    var typedState = state;
                    var koki = new kokiMdl.Model();
                    koki.id(typedState.kokiId);
                    _this.args.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(koki.id()));
                }
            };
            this.window.state.subscribe(function (state) { return _this.args.commandProcessor.floodCommand(new KokiLogic.HandleChangedKokiWinStateCommand(state)); });
        };
        ControllerImpl.prototype.initKonsenskiste = function (konsenskisteModel) {
            this.disposeKonsenskiste();
            var konsenskisteViewModel = new kokiVm.ViewModel;
            this.konsenskisteModel = konsenskisteModel;
            this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.args);
            this.window.kkView(konsenskisteViewModel);
            if (konsenskisteModel)
                this.window.state({ kokiId: konsenskisteModel && konsenskisteModel.id() });
            else
                this.window.state(null);
        };
        ControllerImpl.prototype.disposeKonsenskiste = function () {
            if (this.konsenskisteController)
                this.konsenskisteController.dispose();
        };
        ControllerImpl.prototype.setKonsenskisteModel = function (konsenskisteModel) {
            this.initKonsenskiste(konsenskisteModel);
        };
        ControllerImpl.prototype.dispose = function () {
            this.konsenskisteController.dispose();
            this.subscriptions.forEach(function (s) { return s.dispose(); });
        };
        return ControllerImpl;
    })();
    exports.ControllerImpl = ControllerImpl;
});
