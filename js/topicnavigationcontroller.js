define(["require", "exports", 'controller', 'kokilogic', 'topicnavigationviewmodel', 'topic', 'synchronizers/tsynchronizers', 'command'], function(require, exports, MainController, KokiLogic, ViewModel, Topic, TSync, Commands) {
    var Controller = (function () {
        function Controller(model, viewModel, args) {
            this.modelViewModelController = new ModelViewModelController(model, viewModel, args.commandProcessor);
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
            var _this = this;
            this.model = model;
            this.communicator = communicator;
            this.subscriptions = [];
            this.subscriptions = [
                communicator.containedKokisReceived.subscribe(function (args) {
                    if (Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
                        model.kokis.items.set(args.kokis);
                }),
                model.selectedTopic.subscribe(function (topic) {
                    return _this.onSelectedTopicChanged(topic);
                })
            ];
            this.onSelectedTopicChanged(model.selectedTopic());
        }
        ModelCommunicatorController.prototype.dispose = function () {
            this.subscriptions.forEach(function (s) {
                return s.dispose();
            });
        };

        ModelCommunicatorController.prototype.onSelectedTopicChanged = function (topic) {
            if (topic) {
                this.communicator.queryChildren(this.model.selectedTopic().id, this.model.children);
                this.communicator.queryContainedKokis(this.model.selectedTopic().id, this.model.kokis);
            }
        };
        return ModelCommunicatorController;
    })();
    exports.ModelCommunicatorController = ModelCommunicatorController;

    var ModelViewModelController = (function () {
        function ModelViewModelController(model, viewModel, commandProcessor) {
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
            this.kokiCommandControl.commandProcessor.parent = commandProcessor;

            this.viewModelHistory = ko.observableArray();
            viewModel.breadcrumb = ko.computed(function () {
                return _this.viewModelHistory().slice(0, -1);
            });
            viewModel.selected = ko.computed(function () {
                return _this.viewModelHistory().get(-1);
            });

            this.breadcrumbSync = new TSync.TopicViewModelSync({ commandControl: this.breadcrumbTopicCommandControl });
            this.breadcrumbSync.setModelObservable(model.history).setViewModelObservable(this.viewModelHistory);

            viewModel.children = new ViewModel.Children();
            this.childrenController = new ChildrenViewModelController(model.children, viewModel.children, this.childTopicCommandControl);

            viewModel.kokis = new ViewModel.Kokis();
            this.kokisController = new KokisViewModelController(model.kokis, viewModel.kokis, this.kokiCommandControl);

            viewModel.clickCreateNewKoki = function () {
                commandProcessor.processCommand(new MainController.OpenNewKokiWindowCommand(_this.model.selectedTopic()));
            };
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
            this.kokisController.dispose();
            this.childrenController.dispose();
        };
        return ModelViewModelController;
    })();
    exports.ModelViewModelController = ModelViewModelController;

    var ChildrenViewModelController = (function () {
        function ChildrenViewModelController(model, viewModel, commandControl) {
            viewModel.queryState = model.queryState;

            viewModel.items = ko.observableArray();
            this.childrenSync = new TSync.TopicViewModelSync({ commandControl: commandControl });
            this.childrenSync.setModelObservable(model.items).setViewModelObservable(viewModel.items);
        }
        ChildrenViewModelController.prototype.dispose = function () {
            this.childrenSync.dispose();
        };
        return ChildrenViewModelController;
    })();
    exports.ChildrenViewModelController = ChildrenViewModelController;

    var KokisViewModelController = (function () {
        function KokisViewModelController(model, viewModel, commandControl) {
            viewModel.queryState = model.queryState;

            viewModel.items = ko.observableArray();
            this.kokisSync = new TSync.KokiItemViewModelSync({ commandControl: commandControl });
            this.kokisSync.setModelObservable(model.items).setViewModelObservable(viewModel.items);
        }
        KokisViewModelController.prototype.dispose = function () {
            this.kokisSync.dispose();
        };
        return KokisViewModelController;
    })();
    exports.KokisViewModelController = KokisViewModelController;

    var KokiItemViewModelController = (function () {
        function KokiItemViewModelController(model, viewModel, commandControl) {
            this.viewModel = viewModel;
            this.viewModel.caption = ko.computed(function () {
                return model.general().title() ? model.general().title() : model.general().text();
            });
            this.viewModel.click = function () {
                commandControl && commandControl.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(model));
            };
        }
        KokiItemViewModelController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
        };
        return KokiItemViewModelController;
    })();
    exports.KokiItemViewModelController = KokiItemViewModelController;
});
