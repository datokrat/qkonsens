define(["require", "exports"], function(require, exports) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            viewModel.breadcrumb = ko.computed(function () {
                return model.breadcrumbTopics.get().map(function (t) {
                    return t.title();
                });
            });
        }
        return Controller;
    })();
    exports.Controller = Controller;
});
