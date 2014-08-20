var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', 'factories/konsenskistemodel', 'factories/kernaussagemodel', '../konsenskisteviewmodel', '../konsenskistecontroller', '../event'], function(require, exports, unit, test, kkModelFty, kaModelFty, vm, ctr, Event) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.kkModelFactory = new kkModelFty.Factory().setEventFactory(new TestEventFactory);
            this.kaModelFactory = new kaModelFty.Factory();
        }
        Tests.prototype.testContent = function () {
            var model = this.kkModelFactory.create('Basisdemokratie', 'Beschreibung');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

            test.assert(function () {
                return viewModel.content.title() == 'Basisdemokratie';
            });
            test.assert(function () {
                return viewModel.content.text() == 'Beschreibung';
            });
        };

        Tests.prototype.testChildKas = function () {
            var model = this.kkModelFactory.create('Basisdemokratie (Konzept)', 'Beispiel-Konsenskiste');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

            model.appendKa(this.kaModelFactory.create('Begriff Basisdemokratie'));

            test.assert(function () {
                return viewModel.childKas()[0].content.title() == 'Begriff Basisdemokratie';
            });
            test.assert(function () {
                return viewModel.childKas().length == 1;
            });
            test.assert(function () {
                return !viewModel.childKas()[0].isActive();
            });
        };

        Tests.prototype.testRemoveChildKa = function () {
            var model = this.kkModelFactory.create('Basisdemokratie (Konzept)');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);
            var ka = this.kaModelFactory.create('Begriff Basisdemokratie');

            model.appendKa(this.kaModelFactory.create('Begriff Basisdemokratie'));
            model.removeKa(this.kaModelFactory.create('Begriff Basisdemokratie'));

            test.assert(function () {
                return viewModel.childKas().length == 0;
            });
        };

        Tests.prototype.testDispose = function () {
            var model = this.kkModelFactory.create('Basisdemokratie');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.Controller(model, viewModel);

            controller.dispose();

            test.assert(function () {
                return viewModel.content.title == null;
            });
            test.assert(function () {
                return viewModel.content.text == null;
            });
            test.assert(function () {
                return viewModel.childKas == null;
            });

            var inserted = model.childKaInserted;
            var removed = model.childKaRemoved;

            test.assert(function () {
                return inserted.countListeners() == 0;
            });
            test.assert(function () {
                return removed.countListeners() == 0;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var TestEvent = (function () {
        function TestEvent() {
            this.event = new Event.EventImpl();
            this.listenerCtr = 0;
        }
        TestEvent.prototype.subscribe = function (cb) {
            var _this = this;
            this.listenerCtr++;
            this.event.subscribe(cb);
            return { undo: function () {
                    return _this.unsubscribe(cb);
                } };
        };

        TestEvent.prototype.unsubscribe = function (cb) {
            this.listenerCtr--;
            this.event.unsubscribe(cb);
        };

        TestEvent.prototype.raise = function (args) {
            this.event.raise(args);
        };

        TestEvent.prototype.countListeners = function () {
            return this.listenerCtr;
        };
        return TestEvent;
    })();

    var TestEventFactory = (function () {
        function TestEventFactory() {
        }
        TestEventFactory.prototype.create = function () {
            return new TestEvent();
        };
        return TestEventFactory;
    })();
});
