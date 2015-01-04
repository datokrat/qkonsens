var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'kernaussagemodel', 'kelement', 'factories/event', 'observable'], function(require, exports, KernaussageModel, KElement, EventFactory, Obs) {
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(context) {
            if (typeof context === "undefined") { context = new ModelContext; }
            _super.call(this);
            this.childKas = new Obs.ObservableArrayExtender(ko.observableArray());
            this.error = ko.observable();
            this.loading = ko.observable();
            this.factoryContext = context;
        }
        Model.prototype.set = function (model) {
            console.log('begin set');
            KElement.Model.prototype.set.apply(this, arguments);
            this.setChildKas(model.childKas.get());
            this.loading(model.loading());
            this.error(model.error());
            console.log('end set');
        };

        Model.prototype.setChildKas = function (other) {
            this.childKas.set(other.map(function (otherKa) {
                var ka = new KernaussageModel.Model();
                ka.set(otherKa);
                return ka;
            }));
        };
        return Model;
    })(KElement.Model);
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
