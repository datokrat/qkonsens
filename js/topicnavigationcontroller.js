var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'topic', 'synchronizers/tsynchronizers', 'command'], function(require, exports, Topic, TSync, Commands) {
    var Controller = (function () {
        function Controller(model, viewModel, args) {
            this.modelViewModelController = new ModelViewModelController(model, viewModel, args.commandControl);
            this.modelCommunicatorController = new ModelCommunicatorController(model, args.communicator);
        }
        Controller.prototype.dispose = function () {
            this.modelViewModelController.dispose();
            this.modelCommunicatorController.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var ModelCommunicatorController = (function () {
        function ModelCommunicatorController(model, communicator) {
            this.subscriptions = [];
            this.subscriptions = [
                communicator.childrenReceived.subscribe(function (args) {
                    if (Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
                        model.children.set(args.children);
                }),
                communicator.containedKokisReceived.subscribe(function (args) {
                    if (Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
                        model.kokis.set(args.kokis);
                }),
                model.selectedTopic.subscribe(function (topic) {
                    communicator.queryChildren(model.selectedTopic().id);
                    communicator.queryContainedKokis(model.selectedTopic().id);
                })
            ];
        }
        ModelCommunicatorController.prototype.dispose = function () {
            this.subscriptions.forEach(function (s) {
                return s.dispose();
            });
        };
        return ModelCommunicatorController;
    })();
    exports.ModelCommunicatorController = ModelCommunicatorController;

    var ModelViewModelController = (function () {
        function ModelViewModelController(model, viewModel, commandControl) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;
            this.childTopicCommandControl = { commandProcessor: new Commands.CommandProcessor() };
            this.breadcrumbTopicCommandControl = { commandProcessor: new Commands.CommandProcessor() };
            this.kokiCommandControl = { commandProcessor: new Commands.CommandProcessor() };
            this.childTopicCommandControl.commandProcessor.chain.append(function (cmd) {
                return _this.handleChildTopicCommand(cmd);
            });
            this.breadcrumbTopicCommandControl.commandProcessor.chain.append(function (cmd) {
                return _this.handleBreadcrumbTopicCommand(cmd);
            });
            this.kokiCommandControl.commandProcessor.chain.append(function (cmd) {
                return _this.handleKokiCommand(cmd);
            });
            this.kokiCommandControl.commandProcessor.parent = commandControl && commandControl.commandProcessor;

            this.viewModelHistory = ko.observableArray();
            viewModel.breadcrumb = ko.computed(function () {
                return _this.viewModelHistory().slice(0, -1);
            });
            viewModel.selected = ko.computed(function () {
                return _this.viewModelHistory().get(-1);
            });

            this.breadcrumbSync = new TSync.TopicViewModelSync({ commandControl: this.breadcrumbTopicCommandControl });
            this.breadcrumbSync.setModelObservable(model.history).setViewModelObservable(this.viewModelHistory);

            viewModel.children = ko.observableArray();
            this.childrenSync = new TSync.TopicViewModelSync({ commandControl: this.childTopicCommandControl });
            this.childrenSync.setModelObservable(model.children).setViewModelObservable(viewModel.children);

            viewModel.kokis = ko.observableArray();
            this.kokiSync = new TSync.KokiItemViewModelSync({ commandControl: this.kokiCommandControl });
            this.kokiSync.setViewModelObservable(viewModel.kokis).setModelObservable(model.kokis);
        }
        ModelViewModelController.prototype.handleChildTopicCommand = function (cmd) {
            if (cmd instanceof Topic.TopicSelectedCommand) {
                this.model.selectChild(cmd.model);
                return true;
            }
            return false;
        };

        ModelViewModelController.prototype.handleBreadcrumbTopicCommand = function (cmd) {
            if (cmd instanceof Topic.TopicSelectedCommand) {
                this.model.selectTopicFromHistory(cmd.model);
                return true;
            }
            return false;
        };

        ModelViewModelController.prototype.handleKokiCommand = function (cmd) {
            return false;
        };

        ModelViewModelController.prototype.dispose = function () {
            this.breadcrumbSync.dispose();
            this.childrenSync.dispose();
            this.kokiSync.dispose();
        };
        return ModelViewModelController;
    })();
    exports.ModelViewModelController = ModelViewModelController;

    var KokiItemViewModelController = (function () {
        function KokiItemViewModelController(model, viewModel, commandControl) {
            this.viewModel = viewModel;
            this.viewModel.caption = ko.computed(function () {
                return model.general().title() ? model.general().title() : model.general().text();
            });
            this.viewModel.click = function () {
                commandControl && commandControl.commandProcessor.processCommand(new SelectKokiCommand(model));
            };
        }
        KokiItemViewModelController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
        };
        return KokiItemViewModelController;
    })();
    exports.KokiItemViewModelController = KokiItemViewModelController;

    var SelectKokiCommand = (function (_super) {
        __extends(SelectKokiCommand, _super);
        function SelectKokiCommand(model) {
            _super.call(this);
            this.model = model;
        }
        return SelectKokiCommand;
    })(Commands.Command);
    exports.SelectKokiCommand = SelectKokiCommand;
});
