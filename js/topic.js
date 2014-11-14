define(["require", "exports"], function(require, exports) {
    var ParentController = (function () {
        function ParentController(model, viewModel) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;

            this.viewModel.caption = ko.computed(function () {
                return _this.model.properties().title() || _this.model.properties().text().substr(0, 255);
            });
            this.viewModel.description = ko.computed(function () {
                return !_this.model.properties().title() && _this.model.properties().text();
            });
            this.viewModel.click = function () {
            };
        }
        ParentController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
            this.viewModel.description.dispose();
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
                return _this.model.title() || _this.model.text().substr(0, 255);
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
            this.properties = ko.observable();
            this.children = ko.observableArray();
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

    var ChildViewModel = (function () {
        function ChildViewModel() {
        }
        return ChildViewModel;
    })();
    exports.ChildViewModel = ChildViewModel;
});
