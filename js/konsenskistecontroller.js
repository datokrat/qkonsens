var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'kernaussagemodel', 'factories/kernaussagemodel', 'synchronizers/kokisynchronizers', 'kelement'], function (require, exports, KernaussageModel, KernaussageFactory, KokiSync, KElement) {
    var ControllerImpl = (function (_super) {
        __extends(ControllerImpl, _super);
        function ControllerImpl(model, viewModel, args) {
            var _this = this;
            _super.call(this, model, viewModel, args.communicator, args.commandProcessor);
            this.args = args;
            this.onKokiReceived = function (args) {
                if (_this.model.id() == args.konsenskiste.id())
                    _this.model.set(args.konsenskiste);
            };
            this.onKaAppended = function (args) {
                if (_this.model.id() == args.konsenskisteId) {
                    var ka = new KernaussageModel.Model();
                    ka.id(args.kernaussageId);
                    ka.general().title(args.kernaussageData.title);
                    ka.general().text(args.kernaussageData.text);
                    ka.context().text(args.kernaussageData.context);
                    _this.model.childKas.push(ka);
                }
            };
            this.modelSubscriptions = [];
            this.communicatorSubscriptions = [];
            this.init(model, viewModel, args.communicator);
        }
        ControllerImpl.prototype.init = function (model, viewModel, communicator) {
            this.initCommunicator();
            this.initProperties();
            this.initKas();
        };
        ControllerImpl.prototype.setViewModelContext = function (cxt) {
            this.cxt = cxt;
            this.discussionSynchronizer.setViewModelContext(cxt);
            this.kaSynchronizer.setViewModelContext(cxt);
            return this;
        };
        ControllerImpl.prototype.initProperties = function () {
            this.viewModel.queryState = this.model.queryState;
        };
        ControllerImpl.prototype.initKas = function () {
            var _this = this;
            this.viewModel.childKas = ko.observableArray();
            this.viewModel.newKaFormVisible = ko.observable(false);
            this.viewModel.newKaTitle = ko.observable();
            this.viewModel.newKaText = ko.observable();
            this.viewModel.newKaContext = ko.observable();
            this.viewModel.newKaClick = function () {
                var oldValue = _this.viewModel.newKaFormVisible();
                _this.viewModel.newKaFormVisible(!oldValue);
            };
            this.viewModel.newKaSubmit = function () {
                var kaFactory = new KernaussageFactory.Factory();
                var ka = kaFactory.create(_this.viewModel.newKaText(), _this.viewModel.newKaTitle());
                if (_this.viewModel.newKaContext())
                    ka.context().text(_this.viewModel.newKaContext());
                var kaData = {
                    title: ka.general().title(),
                    text: ka.general().text(),
                    context: ka.context().text()
                };
                _this.communicator.kernaussageAppended.subscribeUntil(function (args) {
                    if (args.konsenskisteId == _this.model.id() && args.kernaussageData == kaData) {
                        _this.viewModel.newKaFormVisible(false);
                        return true;
                    }
                });
                _this.communicator.createAndAppendKa(_this.model.id(), kaData);
            };
            this.kaSynchronizer = new KokiSync.KaSynchronizer({ communicator: this.communicator.kernaussage, commandProcessor: this.args.commandProcessor });
            this.kaSynchronizer
                .setViewModelObservable(this.viewModel.childKas)
                .setModelObservable(this.model.childKas);
        };
        ControllerImpl.prototype.initCommunicator = function () {
            this.communicatorSubscriptions = ([
                this.communicator.received.subscribe(this.onKokiReceived),
                this.communicator.kernaussageAppended.subscribe(this.onKaAppended)
            ]);
        };
        ControllerImpl.prototype.dispose = function () {
            KElement.Controller.prototype.dispose.apply(this, arguments);
            this.modelSubscriptions.forEach(function (s) { return s.dispose(); });
            this.communicatorSubscriptions.forEach(function (s) { return s.dispose(); });
        };
        return ControllerImpl;
    })(KElement.Controller);
    exports.ControllerImpl = ControllerImpl;
});
