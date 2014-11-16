define(["require", "exports", 'observable'], function(require, exports, Obs) {
    var ModelImpl = (function () {
        function ModelImpl() {
            var _this = this;
            this.breadcrumbTopics = new Obs.ObservableArrayExtender(ko.observableArray());
            this.selectedTopic = ko.computed(function () {
                return _this.breadcrumbTopics && _this.breadcrumbTopics.get(-1);
            });
        }
        ModelImpl.prototype.appendChild = function (child) {
            this.breadcrumbTopics.push(child);
        };

        ModelImpl.prototype.goBackToBreadcrumbTopic = function (index) {
            this.breadcrumbTopics.removeMany(index + 1);
        };
        return ModelImpl;
    })();
    exports.ModelImpl = ModelImpl;
});
