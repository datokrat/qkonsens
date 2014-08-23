define(["require", "exports"], function(require, exports) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            this.viewModel = viewModel;

            this.viewModel.text = ko.computed(function () {
                return model.text();
            });
            this.viewModel.isVisible = ko.observable(false);
        }
        Controller.prototype.dispose = function () {
            this.viewModel.text.dispose();
        };
        return Controller;
    })();

    
    return Controller;
});
