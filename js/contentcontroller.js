var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            this.init(model, viewModel);
        }
        Controller.prototype.init = function (model, viewModel) {
            this.viewModel = viewModel;
            this.model = model;

            this.viewModel.title = ko.computed(function () {
                return model.title();
            });
            this.viewModel.text = ko.computed(function () {
                return model.text();
            });
        };

        Controller.prototype.dispose = function () {
            this.viewModel.title.dispose();
            this.viewModel.text.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var WithContext = (function (_super) {
        __extends(WithContext, _super);
        function WithContext(model, viewModel) {
            _super.call(this, model, viewModel);
            this.initContext(model, viewModel);
        }
        WithContext.prototype.initContext = function (model, viewModel) {
            this.viewModelWithContext = viewModel;
            this.viewModelWithContext.context = ko.computed(function () {
                return model.context();
            });
        };

        WithContext.prototype.dispose = function () {
            Controller.prototype.dispose.apply(this, arguments);

            this.viewModelWithContext.context.dispose();
        };
        return WithContext;
    })(Controller);
    exports.WithContext = WithContext;
});
