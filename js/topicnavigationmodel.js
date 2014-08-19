///<reference path="../typings/knockout.d.ts" />
///<reference path="array.ts" />
define(["require", "exports"], function(require, exports) {
    var ModelImpl = (function () {
        function ModelImpl() {
            this.breadcrumbTopics = ko.observableArray();
        }
        ModelImpl.prototype.appendChild = function (child) {
            this.breadcrumbTopics.push(child);
        };

        ModelImpl.prototype.goBackToBreadcrumbTopic = function (index) {
            this.breadcrumbTopics.splice(index + 1);
        };

        ModelImpl.prototype.getSelectedTopic = function () {
            return this.breadcrumbTopics().get(-1);
        };

        ModelImpl.prototype.getBreadcrumbTopics = function () {
            return this.breadcrumbTopics();
        };
        return ModelImpl;
    })();
    exports.ModelImpl = ModelImpl;
});
