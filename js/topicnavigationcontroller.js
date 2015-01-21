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
                communicator.childrenReceived.subscribe(function (args) {
                    if (Topic.IdentifierHelper.equals(args.id, model.selectedTopic().id))
                        model.children.items.set(args.children);
                }),
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
                this.communicator.queryChildren(this.model.selectedTopic().id);
                this.communicator.queryContainedKokis(this.model.selectedTopic().id);
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
            viewModel.children.items = ko.observableArray();
            this.childrenSync = new TSync.TopicViewModelSync({ commandControl: this.childTopicCommandControl });
            this.childrenSync.setModelObservable(model.children.items).setViewModelObservable(viewModel.children.items);

            viewModel.kokis = new ViewModel.Kokis();
            viewModel.kokis.items = ko.observableArray();
            this.kokiSync = new TSync.KokiItemViewModelSync({ commandControl: this.kokiCommandControl });
            this.kokiSync.setViewModelObservable(viewModel.kokis.items).setModelObservable(model.kokis.items);

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
