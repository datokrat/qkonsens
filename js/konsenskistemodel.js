define(["require", "exports", 'contentmodel', 'factories/event'], function(require, exports, Content, EventFactory) {
    var Model = (function () {
        function Model(context) {
            if (typeof context === "undefined") { context = new ModelContext; }
            this.content = ko.observable(new Content.WithContext());
            this.kaArray = ko.observableArray();
            this.childKaInserted = context.eventFactory.create();
            this.childKaRemoved = context.eventFactory.create();
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

    var ModelContext = (function () {
        function ModelContext() {
            this.eventFactory = new EventFactory.FactoryImpl();
        }
        return ModelContext;
    })();
    exports.ModelContext = ModelContext;
});
