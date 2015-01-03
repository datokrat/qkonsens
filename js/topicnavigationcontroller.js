define(["require", "exports", 'topic', 'synchronizers/tsynchronizers'], function(require, exports, Topic, TSync) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.modelViewModelController = new ModelViewModelController(model, viewModel);
            this.modelCommunicatorController = new ModelCommunicatorController(model, communicator);
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
                        model.kokis.set(args.kokis.map(function (k) {
                            return k.general();
                        }));
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
        function ModelViewModelController(model, viewModel) {
            var _this = this;
            this.viewModelHistory = ko.observableArray();
            viewModel.breadcrumb = ko.computed(function () {
                return _this.viewModelHistory().slice(0, -1);
            });
            viewModel.selected = ko.computed(function () {
                return _this.viewModelHistory().get(-1);
            });
            this.breadcrumbSync = new TSync.TopicViewModelSync();
            this.breadcrumbSync.setModelObservable(model.history).setViewModelObservable(this.viewModelHistory);

            this.breadcrumbSync.itemCreated.subscribe(function (args) {
                args.viewModel.click.subscribe(function () {
                    model.selectTopicFromHistory(args.model);
                });
            });

            viewModel.children = ko.observableArray();
            this.childrenSync = new TSync.TopicViewModelSync();
            this.childrenSync.setModelObservable(model.children).setViewModelObservable(viewModel.children);

            this.childrenSync.itemCreated.subscribe(function (args) {
                args.viewModel.click.subscribe(function () {
                    model.selectChild(args.model);
                });
            });

            viewModel.kokis = ko.observableArray();
            this.kokiSync = new TSync.KokiItemViewModelSync();
            this.kokiSync.setViewModelObservable(viewModel.kokis).setModelObservable(model.kokis);
        }
        ModelViewModelController.prototype.dispose = function () {
            this.breadcrumbSync.dispose();
            this.childrenSync.dispose();
            this.kokiSync.dispose();
        };
        return ModelViewModelController;
    })();
    exports.ModelViewModelController = ModelViewModelController;

    var KokiItemViewModelController = (function () {
        function KokiItemViewModelController(model, viewModel) {
            this.viewModel = viewModel;
            this.viewModel.caption = ko.computed(function () {
                return model.title() ? model.title() : model.text();
            });
        }
        KokiItemViewModelController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
        };
        return KokiItemViewModelController;
    })();
    exports.KokiItemViewModelController = KokiItemViewModelController;
});
