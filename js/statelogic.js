define(["require", "exports", 'locationhash', 'memory'], function(require, exports, LocationHash, Memory) {
    var Controller = (function () {
        function Controller(resources) {
            var _this = this;
            this.resources = resources;
            this.disposables = new Memory.DisposableContainer();
            this.disposables.append(LocationHash.changed.subscribe(function () {
                return _this.onHashChangedManually();
            }));
        }
        Controller.prototype.updateHash = function () {
        };

        Controller.prototype.onHashChangedManually = function () {
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var Resources = (function () {
        function Resources() {
        }
        return Resources;
    })();
    exports.Resources = Resources;
});
