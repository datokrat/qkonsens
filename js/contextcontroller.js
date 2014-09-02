define(["require", "exports", 'event'], function(require, exports, Events) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            var _this = this;
            this.viewModel = viewModel;

            this.viewModel.text = ko.computed(function () {
                return model.text();
            });
            this.viewModel.isVisible = ko.observable(false);

            this.viewModel.toggleVisibility = new Events.EventImpl();
            this.viewModel.toggleVisibility.subscribe(function () {
                return _this.toggleVisibility();
            });
        }
        Controller.prototype.toggleVisibility = function () {
            var isVisible = this.viewModel.isVisible();
            this.viewModel.isVisible(!isVisible);
        };

        Controller.prototype.dispose = function () {
            this.viewModel.text.dispose();
        };
        return Controller;
    })();

    
    return Controller;
});
