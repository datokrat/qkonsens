var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'factories/constructorbased', 'synchronizers/childarraysynchronizer', '../topic', '../topicnavigationviewmodel', '../topicnavigationcontroller'], function(require, exports, Factory, Sync, Topic, TopicNavigationViewModel, TopicNavigationController) {
    var TopicViewModelSync = (function (_super) {
        __extends(TopicViewModelSync, _super);
        function TopicViewModelSync(args) {
            _super.call(this);
            this.fty = new ModelViewModelControllerFactory();

            this.setViewModelFactory(new Factory.Factory(Topic.ViewModel));
            this.setControllerFactory(new Factory.ControllerFactoryEx(Topic.ModelViewModelController, args.commandControl));
        }
        return TopicViewModelSync;
    })(Sync.ObservingChildArraySynchronizer);
    exports.TopicViewModelSync = TopicViewModelSync;

    var TopicCommunicatorSync = (function (_super) {
        __extends(TopicCommunicatorSync, _super);
        function TopicCommunicatorSync() {
            _super.call(this);
        }
        TopicCommunicatorSync.prototype.setCommunicator = function (communicator) {
            this.setControllerFactory(new ModelCommunicatorControllerFactory(communicator));
        };
        return TopicCommunicatorSync;
    })(Sync.PureModelArraySynchronizer);
    exports.TopicCommunicatorSync = TopicCommunicatorSync;

    var KokiItemViewModelSync = (function (_super) {
        __extends(KokiItemViewModelSync, _super);
        function KokiItemViewModelSync() {
            _super.call(this);
            this.setViewModelFactory(new Factory.Factory(TopicNavigationViewModel.KokiItem));
            this.setControllerFactory(new Factory.ControllerFactory(TopicNavigationController.KokiItemViewModelController));
        }
        return KokiItemViewModelSync;
    })(Sync.ObservingChildArraySynchronizer);
    exports.KokiItemViewModelSync = KokiItemViewModelSync;

    var ModelCommunicatorControllerFactory = (function () {
        function ModelCommunicatorControllerFactory(communicator) {
            this.communicator = communicator;
        }
        ModelCommunicatorControllerFactory.prototype.create = function (model) {
            return new Topic.ModelCommunicatorController(model, this.communicator);
        };
        return ModelCommunicatorControllerFactory;
    })();

    var ModelViewModelControllerFactory = (function () {
        function ModelViewModelControllerFactory() {
        }
        ModelViewModelControllerFactory.prototype.create = function (model, viewModel) {
            return new Topic.ModelViewModelController(model, viewModel);
        };
        return ModelViewModelControllerFactory;
    })();

    var ControllerFactory = (function () {
        function ControllerFactory() {
        }
        ControllerFactory.prototype.create = function (model, viewModel) {
            if (this.communicator == null)
                throw new Error('this.communicator is null');
            return new Topic.Controller(model, viewModel, this.communicator);
        };

        ControllerFactory.prototype.setCommunicator = function (communicator) {
            this.communicator = communicator;
        };
        return ControllerFactory;
    })();
});
