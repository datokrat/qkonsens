///<reference path="array.ts" />
define(["require", "exports"], function(require, exports) {
    var ModelController = (function () {
        function ModelController(model) {
            this.model = model;
        }
        ModelController.prototype.selectChildTopic = function (child) {
            this.model.breadcrumbTopics.push(child);
        };

        ModelController.prototype.selectBreadcrumbTopic = function (index) {
            this.model.breadcrumbTopics.splice(index + 1);
        };

        ModelController.prototype.getSelectedTopic = function () {
            return this.model.breadcrumbTopics().get(-1);
        };

        ModelController.prototype.getBreadcrumbTopics = function () {
            return this.model.breadcrumbTopics();
        };
        return ModelController;
    })();
    exports.ModelController = ModelController;
});
