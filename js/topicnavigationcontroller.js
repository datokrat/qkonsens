define(["require", "exports", 'event', 'synchronizers/tsynchronizers'], function(require, exports, Evt, TSync) {
    var ModelCommunicatorController = (function () {
        function ModelCommunicatorController(model, communicator) {
            this.subscriptions = [];
            this.subscriptions = [
                communicator.childrenReceived.subscribe(function (args) {
                    model.children.set(args.children);
                }),
                Evt.Subscription.fromDisposable(model.selectedTopic.subscribe(function (topic) {
                    communicator.queryChildren(model.selectedTopic().id);
                }))
            ];
        }
        ModelCommunicatorController.prototype.dispose = function () {
            this.subscriptions.forEach(function (s) {
                return s.undo();
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
            this.breadcrumbSync = new TSync.TopicSync().setModelObservable(model.history).setViewModelObservable(this.viewModelHistory);

            this.breadcrumbSync.itemCreated.subscribe(function (args) {
                args.viewModel.click.subscribe(function () {
                    model.selectTopicFromHistory(args.model);
                });
            });

            viewModel.children = ko.observableArray();
            this.childrenSync = new TSync.TopicSync().setModelObservable(model.children).setViewModelObservable(viewModel.children);

            this.childrenSync.itemCreated.subscribe(function (args) {
                args.viewModel.click.subscribe(function () {
                    model.selectChild(args.model);
                });
            });
        }
        ModelViewModelController.prototype.dispose = function () {
            this.breadcrumbSync.dispose();
            this.childrenSync.dispose();
        };
        return ModelViewModelController;
    })();
    exports.ModelViewModelController = ModelViewModelController;

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
});
