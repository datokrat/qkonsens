define(["require", "exports"], function (require, exports) {
    var Factory = (function () {
        function Factory(construct) {
            this.create = function () { return new construct(); };
        }
        return Factory;
    })();
    exports.Factory = Factory;
    var ControllerFactory = (function () {
        function ControllerFactory(construct) {
            var _this = this;
            this.create = function (m, v) {
                var ret = new construct(m, v);
                _this.afterCreation && _this.afterCreation(m, v, ret);
                return ret;
            };
        }
        ControllerFactory.prototype.setAfterCreationHandler = function (handler) {
            this.afterCreation = handler;
        };
        return ControllerFactory;
    })();
    exports.ControllerFactory = ControllerFactory;
    var ControllerFactoryEx = (function () {
        function ControllerFactoryEx(construct, communicator) {
            var _this = this;
            this.communicator = communicator;
            this.create = function (m, v) { return new construct(m, v, _this.communicator); };
        }
        return ControllerFactoryEx;
    })();
    exports.ControllerFactoryEx = ControllerFactoryEx;
});
