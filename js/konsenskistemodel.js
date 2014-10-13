define(["require", "exports", 'contentmodel', 'rating', 'discussion', 'factories/event', 'observable'], function(require, exports, Content, Rating, Discussion, EventFactory, Obs) {
    var Model = (function () {
        function Model(context) {
            if (typeof context === "undefined") { context = new ModelContext; }
            this.id = ko.observable();
            this.general = ko.observable(new Content.General);
            this.context = ko.observable(new Content.Context);
            this.rating = ko.observable(new Rating.Model);
            this.childKas = new Obs.ObservableArrayExtender(ko.observableArray());
            this.discussion = ko.observable(new Discussion.Model);
            this.factoryContext = context;
        }
        Model.prototype.set = function (model) {
            this.id(model.id());
            this.general().set(model.general());
            this.context().set(model.context());
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
