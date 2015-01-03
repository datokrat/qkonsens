var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'command'], function(require, exports, Commands) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.modelViewModelController = new ModelViewModelController(model, viewModel);
            this.modelCommunicatorController = new ModelCommunicatorController(model, communicator);
        }
        Controller.prototype.dispose = function () {
            this.modelViewModelController.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var ModelViewModelController = (function () {
        function ModelViewModelController(model, viewModel, parent) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;

            this.viewModel.caption = ko.computed(function () {
                return _this.model.title() || (_this.model.text() && _this.model.text().substr(0, 255));
            });
            this.viewModel.description = ko.computed(function () {
                return _this.model.title() && _this.model.text();
            });

            //this.viewModel.click = new Evt.EventImpl<void>();
            this.viewModel.click = function () {
                parent && parent.commandProcessor.processCommand(new TopicSelectedCommand(model, viewModel));
            };
        }
        ModelViewModelController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
            this.viewModel.description.dispose();
        };
        return ModelViewModelController;
    })();
    exports.ModelViewModelController = ModelViewModelController;

    var TopicSelectedCommand = (function (_super) {
        __extends(TopicSelectedCommand, _super);
        function TopicSelectedCommand(model, viewModel) {
            _super.call(this);
            this.model = model;
            this.viewModel = viewModel;
        }
        return TopicSelectedCommand;
    })(Commands.Command);
    exports.TopicSelectedCommand = TopicSelectedCommand;

    var ModelCommunicatorController = (function () {
        function ModelCommunicatorController(model, communicator) {
            this.communicatorSubscriptions = [];
            this.modelSubscriptions = [];
        }
        ModelCommunicatorController.prototype.dispose = function () {
            this.communicatorSubscriptions.forEach(function (s) {
                return s.dispose();
            });
            this.communicatorSubscriptions = [];

            this.modelSubscriptions.forEach(function (s) {
                return s.dispose();
            });
            this.modelSubscriptions = [];
        };
        return ModelCommunicatorController;
    })();
    exports.ModelCommunicatorController = ModelCommunicatorController;

    var Model = (function () {
        function Model() {
            this.title = ko.observable();
            this.text = ko.observable();
        }
        Model.prototype.set = function (other) {
            this.title(other.title());
            this.text(other.text());
            this.id = other.id;
            return this;
        };
        return Model;
    })();
    exports.Model = Model;

    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;

    var IdentifierHelper = (function () {
        function IdentifierHelper() {
        }
        IdentifierHelper.equals = function (id1, id2) {
            return (id1.root && id2.root) || (!id1.root && !id1.root && id1.id == id2.id);
        };
        return IdentifierHelper;
    })();
    exports.IdentifierHelper = IdentifierHelper;
});
