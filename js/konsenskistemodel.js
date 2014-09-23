define(["require", "exports", 'contentmodel', 'factories/event'], function(require, exports, Content, EventFactory) {
    var Model = (function () {
        function Model(context) {
            if (typeof context === "undefined") { context = new ModelContext; }
            this.general = ko.observable(new Content.General);
            this.context = ko.observable(new Content.Context);
            this.kaArray = ko.observableArray();
            this.childKaInserted = context.eventFactory.create();
            this.childKaRemoved = context.eventFactory.create();
        }
        Model.prototype.set = function (model) {
            this.id = model.id;
            this.general().set(model.general());
            this.context().set(model.context());
        };

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
