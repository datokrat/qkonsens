define(["require", "exports", 'factories/konsenskistecontroller', '../konsenskistemodel', '../konsenskisteviewmodel', '../kokilogic'], function(require, exports, KokiControllerFactory, kokiMdl, kokiVm, KokiLogic) {
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
                    _this.args.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(koki));
                    //this.setKonsenskisteModelById(typedState.kokiId);
                }
            };
            this.window.state.subscribe(function (state) {
                return _this.args.commandProcessor.floodCommand(new KokiLogic.HandleChangedKokiWinStateCommand(state));
            });
        };

        /*public setKonsenskisteModelById(id: number) {
        throw new Error('cxt is an old field - shouldn\'t be used');
        if(!this.cxt.konsenskisteModel() || this.cxt.konsenskisteModel().id() != id)
        this.cxt.konsenskisteModel(this.communicator.query(id));
        }*/
        ControllerImpl.prototype.initKonsenskiste = function (konsenskisteModel) {
            this.disposeKonsenskiste();

            var konsenskisteViewModel = new kokiVm.ViewModel;
            this.konsenskisteModel = konsenskisteModel;
            this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.args);

            //if(this.cxt) this.konsenskisteController.setViewModelContext(this.cxt);
            this.window.kkView(konsenskisteViewModel);
            this.window.state((konsenskisteModel && konsenskisteModel.id()) ? { kokiId: konsenskisteModel.id() } : null);
        };

        ControllerImpl.prototype.disposeKonsenskiste = function () {
            if (this.konsenskisteController)
                this.konsenskisteController.dispose();
        };

        /*public setContext(cxt: ViewModelContext) {
        this.cxt = cxt;
        this.konsenskisteController.setViewModelContext(cxt);
        return this;
        }*/
        ControllerImpl.prototype.setKonsenskisteModel = function (konsenskisteModel) {
            this.initKonsenskiste(konsenskisteModel);
            //this.setContext(this.cxt);
        };

        ControllerImpl.prototype.dispose = function () {
            this.konsenskisteController.dispose();
            this.subscriptions.forEach(function (s) {
                return s.dispose();
            });
        };
        return ControllerImpl;
    })();
    exports.ControllerImpl = ControllerImpl;
});
