define(["require", "exports"], function(require, exports) {
    var Model = (function () {
        function Model() {
            this.personalRating = ko.observable('none');
        }
        return Model;
    })();
    exports.Model = Model;

    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;

    var Controller = (function () {
        function Controller(model, viewModel) {
            viewModel.personalRating = model.personalRating;
        }
        return Controller;
    })();
    exports.Controller = Controller;
});
