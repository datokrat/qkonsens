define(["require", "exports", "../event"], function (require, exports, Event) {
    var FactoryImpl = (function () {
        function FactoryImpl() {
        }
        FactoryImpl.prototype.create = function () {
            return new Event.EventImpl();
        };
        return FactoryImpl;
    })();
    exports.FactoryImpl = FactoryImpl;
});
