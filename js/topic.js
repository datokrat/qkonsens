define(["require", "exports", 'observable', 'synchronizers/tsynchronizers'], function(require, exports, Obs, TSync) {
    var ParentController = (function () {
        function ParentController(model, viewModel) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;

            this.viewModel.caption = ko.computed(function () {
                return _this.model.properties().title() || _this.getShortenedText();
            });
            this.viewModel.description = ko.computed(function () {
                return _this.model.properties().title() && _this.model.properties().text();
            });
            this.viewModel.children = ko.observableArray();
            this.childTopicSync = new TSync.ChildTopicSync().setModelObservable(this.model.children).setViewModelObservable(this.viewModel.children);

            this.viewModel.click = function () {
            };
        }
        ParentController.prototype.getShortenedText = function () {
            return this.model.properties().text() && this.model.properties().text().substr(0, 255);
        };

        ParentController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
            this.viewModel.description.dispose();
            this.childTopicSync.dispose();
        };
        return ParentController;
    })();
    exports.ParentController = ParentController;

    var ChildController = (function () {
        function ChildController(model, viewModel) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;

            this.viewModel.caption = ko.computed(function () {
                return _this.model.title() || (_this.model.text() && _this.model.text().substr(0, 255));
            });
            this.viewModel.click = function () {
            };
        }
        ChildController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
        };
        return ChildController;
    })();
    exports.ChildController = ChildController;

    var ParentModel = (function () {
        function ParentModel() {
            this.properties = ko.observable(new Model);
            this.children = new Obs.ObservableArrayExtender(ko.observableArray());
        }
        return ParentModel;
    })();
    exports.ParentModel = ParentModel;

    var Model = (function () {
        function Model() {
            this.parent = ko.observable();
            //public children = ko.observableArray<TopicModel>();
            //public kks = ko.observableArray<Konsenskiste>();
            this.title = ko.observable();
            this.text = ko.observable();
        }
        return Model;
    })();
    exports.Model = Model;

    var ParentViewModel = (function () {
        function ParentViewModel() {
        }
        return ParentViewModel;
    })();
    exports.ParentViewModel = ParentViewModel;

    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
