define(["require", "exports", 'event'], function(require, exports, evt) {
    var Model = (function () {
        function Model() {
            this.title = ko.observable();
            this.childKaInserted = new evt.EventImpl();
            this.childKaRemoved = new evt.EventImpl();
            this.kaArray = ko.observableArray();
        }
        Model.prototype.appendKa = function (ka) {
            this.kaArray.push(ka);

            this.childKaInserted.raise({ childKa: ka });
        };

        Model.prototype.removeKa = function (ka) {
            this.kaArray.remove(ka);

            this.childKaRemoved.raise({ childKa: ka });
        };

        Model.prototype.getChildKaArray = function () {
            return this.kaArray();
        };
        return Model;
    })();
    exports.Model = Model;

    var ChildKaEventArgs = (function () {
        function ChildKaEventArgs() {
        }
        return ChildKaEventArgs;
    })();
    exports.ChildKaEventArgs = ChildKaEventArgs;
});
