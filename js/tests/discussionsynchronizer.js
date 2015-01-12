var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../discussion', 'tests/testdiscussioncommunicator', 'synchronizers/ksynchronizers', '../viewmodelcontext', 'factories/constructorbased'], function(require, exports, unit, test, Discussion, DiscussionCommunicator, KSync, ViewModelContext, Factories) {
    var Mocker = (function () {
        function Mocker() {
        }
        Mocker.mock = function (parentClass, name, mock) {
            var old = parentClass.prototype[name];
            parentClass.prototype[name] = function () {
                var a = [old];
                a = a.concat(arguments);
                mock.apply(this, a);
            };

            return { unmock: function () {
                    return parentClass.prototype[name] = old;
                } };
        };
        return Mocker;
    })();

    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.setUp = function () {
            this.sync = new KSync.DiscussionSynchronizer({ communicator: new DiscussionCommunicator, commandProcessor: null });
        };

        TestClass.prototype.setViewModelContext = function () {
            var ctr = 0;
            Mocker.mock(Discussion.Controller, 'setViewModelContext', function (old, args) {
                ++ctr;
                old.apply(this, args);
            });

            var model = new Discussion.Model();
            this.sync.setViewModelFactory(new Factories.Factory(Discussion.ViewModel));
            this.sync.setControllerFactory(new Factories.ControllerFactoryEx(Discussion.Controller, { communicator: new DiscussionCommunicator, commandProcessor: null }));
            this.sync.setModelObservable(ko.observable(model));
            this.sync.setViewModelObservable(ko.observable());
            this.sync.setViewModelContext(new ViewModelContext(null, null, null));
            test.assert(function () {
                return ctr == 1;
            });
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
