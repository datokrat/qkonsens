define(["require", "exports"], function (require, exports) {
    var DisposableBase = (function () {
        function DisposableBase() {
        }
        DisposableBase.prototype.dispose = function () { };
        return DisposableBase;
    })();
    exports.DisposableBase = DisposableBase;
    var DisposableContainer = (function () {
        function DisposableContainer() {
            this.disposables = [];
        }
        DisposableContainer.prototype.append = function (arg) {
            if (arg instanceof Array)
                this.disposables = this.disposables.concat(arg);
            else if ('dispose' in arg) {
                this.disposables.push(arg);
                return arg;
            }
        };
        DisposableContainer.prototype.dispose = function () {
            this.disposables.forEach(function (d) { return d.dispose(); });
            this.disposables = [];
        };
        return DisposableContainer;
    })();
    exports.DisposableContainer = DisposableContainer;
});
