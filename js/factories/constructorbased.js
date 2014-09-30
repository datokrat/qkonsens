define(["require", "exports"], function(require, exports) {
    var Factory = (function () {
        function Factory(construct) {
            this.create = function () {
                return new construct();
            };
        }
        return Factory;
    })();
    exports.Factory = Factory;

    var ControllerFactory = (function () {
        function ControllerFactory(construct) {
            this.create = function (m, v) {
                return new construct(m, v);
            };
        }
        return ControllerFactory;
    })();
    exports.ControllerFactory = ControllerFactory;

    var ControllerFactoryEx = (function () {
        function ControllerFactoryEx(construct, communicator) {
            var _this = this;
            this.communicator = communicator;
            this.create = function (m, v) {
                return new construct(m, v, _this.communicator);
            };
        }
        return ControllerFactoryEx;
    })();
    exports.ControllerFactoryEx = ControllerFactoryEx;
});
