define(["require", "exports", 'contentmodel', 'rating', 'factories/event'], function(require, exports, Content, Rating, EventFactory) {
    var Model = (function () {
        function Model(context) {
            if (typeof context === "undefined") { context = new ModelContext; }
            this.general = ko.observable(new Content.General);
            this.context = ko.observable(new Content.Context);
            this.rating = ko.observable(new Rating.Model);
            this.childKas = ko.observableArray();
            this.childKaInserted = context.eventFactory.create();
            this.childKaRemoved = context.eventFactory.create();
        }
        Model.prototype.set = function (model) {
            this.id = model.id;
            this.general().set(model.general());
            this.context().set(model.context());
        };

        Model.prototype.appendKa = function (ka) {
            this.childKas.push(ka);

            this.childKaInserted.raise({ childKa: ka });
        };

        Model.prototype.removeKa = function (ka) {
            this.childKas.remove(ka);

            this.childKaRemoved.raise({ childKa: ka });
        };

        Model.prototype.getChildKaArray = function () {
            return this.childKas();
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
