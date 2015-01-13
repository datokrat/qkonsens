var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', 'factories/konsenskistemodel', 'factories/kernaussagemodel', '../kernaussagemodel', '../konsenskisteviewmodel', '../konsenskistecontroller', '../contentmodel', '../rating', '../comment', 'tests/testkonsenskistecommunicator', '../event'], function(require, exports, unit, test, kkModelFty, kaModelFty, KernaussageModel, vm, ctr, ContentModel, Rating, Comment, KokiCommunicator, Event) {
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
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });

            model.context().text('Der Klärtext');

            test.assert(function () {
                return viewModel.general().title() == 'Basisdemokratie';
            });
            test.assert(function () {
                return viewModel.general().text() == 'Beschreibung';
            });
            test.assert(function () {
                return viewModel.context().text() == 'Der Klärtext';
            });
        };

        Tests.prototype.testContentObservables = function () {
            var model = this.kkModelFactory.create('Basisdemokratie', 'Beschreibung');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });
            var titleTracker = [];
            var textTracker = [];

            viewModel.general().title.subscribe(function (newTitle) {
                titleTracker.push(newTitle);
            });
            viewModel.general().text.subscribe(function (newText) {
                textTracker.push(newText);
            });
            model.general().title('New Title');
            model.general().text('New Text');

            test.assert(function () {
                return titleTracker.length == 1;
            });
            test.assert(function () {
                return titleTracker[0] == 'New Title';
            });
            test.assert(function () {
                return textTracker.length == 1;
            });
            test.assert(function () {
                return textTracker[0] == 'New Text';
            });
        };

        Tests.prototype.testChildKas = function () {
            var model = this.kkModelFactory.create('Basisdemokratie (Konzept)', 'Beispiel-Konsenskiste');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });

            model.childKas.push(this.kaModelFactory.create('', 'Begriff Basisdemokratie'));

            test.assert(function () {
                return viewModel.childKas()[0].general().title() == 'Begriff Basisdemokratie';
            });
            test.assert(function () {
                return viewModel.childKas().length == 1;
            });
        };

        Tests.prototype.testRemoveChildKa = function () {
            var model = this.kkModelFactory.create('Basisdemokratie (Konzept)');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });
            var ka = this.kaModelFactory.create('', 'Begriff Basisdemokratie');

            model.childKas.push(ka);
            model.childKas.remove(ka);

            test.assert(function () {
                return viewModel.childKas().length == 0;
            });
        };

        Tests.prototype.testDispose = function () {
            var model = this.kkModelFactory.create('Basisdemokratie');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });

            controller.dispose();

            var inserted = model.childKas.pushed;
            var removed = model.childKas.removed;

            model.childKas.push(this.kaModelFactory.create('', 'Test'));

            //TODO: Make this possible again
            //test.assert( () => inserted.countListeners() == 0 );
            //test.assert( () => removed.countListeners() == 0 );
            test.assert(function () {
                return viewModel.general().title() == 'Basisdemokratie';
            });
        };

        Tests.prototype.testRating = function () {
            var model = this.kkModelFactory.create('Basisdemokratie');
            var viewModel = new vm.ViewModel;
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });

            model.rating().personalRating('like');

            test.assert(function () {
                return viewModel.rating().personalRating() == 'like';
            });
        };

        Tests.prototype.testChangingFields = function () {
            var model = this.kkModelFactory.create('Basisdemokratie');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });

            model.general().title('title');
            model.general(new ContentModel.General);

            model.context().text('context');
            model.context(new ContentModel.Context);

            model.rating().personalRating('like');
            model.rating(new Rating.Model);

            test.assert(function () {
                return viewModel.general().title() != 'title';
            });
            test.assert(function () {
                return viewModel.context().text() != 'context';
            });
            test.assert(function () {
                return viewModel.rating().personalRating() != 'like';
            });
        };

        Tests.prototype.testComments = function () {
            var model = this.kkModelFactory.create('Basisdemokratie');
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: new KokiCommunicator.Main, commandProcessor: null });

            var comment = new Comment.Model();
            comment.content().text('A Comment');
            model.discussion().comments.push(comment);

            test.assert(function () {
                return viewModel.discussion().comments().length == 1;
            });
            test.assert(function () {
                return viewModel.discussion().comments()[0].content().text() == 'A Comment';
            });
        };

        Tests.prototype.appendKaViaCommunicator = function () {
            var eventCtr = 0;
            var model = this.kkModelFactory.create('Basisdemokratie');
            model.id(2);
            var viewModel = new vm.ViewModel();
            var communicator = new KokiCommunicator.Main();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: communicator, commandProcessor: null });

            var serverKoki = this.kkModelFactory.create('Basisdemokratie');
            serverKoki.id(2);
            communicator.setTestKoki(serverKoki);
            communicator.kernaussageAppended.subscribe(function () {
                return ++eventCtr;
            });

            var kernaussage = new KernaussageModel.Model();
            communicator.createAndAppendKa(model.id(), kernaussage);

            test.assert(function () {
                return eventCtr == 1;
            });
        };

        Tests.prototype.appendKaViaCommunicator_error = function () {
            var errorCtr = 0;
            var successCtr = 0;
            var model = this.kkModelFactory.create('Title', 'Text', 2);
            var serverKoki = this.kkModelFactory.create('Title', 'Text', 3);
            var viewModel = new vm.ViewModel();
            var communicator = new KokiCommunicator.Main();
            var controller = new ctr.ControllerImpl(model, viewModel, { communicator: communicator, commandProcessor: null });

            communicator.setTestKoki(serverKoki);
            communicator.kernaussageAppendingError.subscribe(function () {
                return ++errorCtr;
            });
            communicator.kernaussageAppended.subscribe(function () {
                return ++successCtr;
            });

            var kernaussage = new KernaussageModel.Model();
            communicator.createAndAppendKa(model.id(), kernaussage);

            test.assert(function () {
                return successCtr == 0;
            });
            test.assert(function () {
                return errorCtr == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var TestEvent = (function () {
        function TestEvent() {
            this.event = new Event.EventImpl();
            this.listenerCtr = 0;
            this.raiseThis = this.raise.bind(this);
        }
        TestEvent.prototype.subscribe = function (cb) {
            var _this = this;
            this.listenerCtr++;
            this.event.subscribe(cb);
            return { dispose: function () {
                    return _this.unsubscribe(cb);
                } };
        };

        TestEvent.prototype.subscribeUntil = function (cb, timeout) {
            var subscription;
            var handler = function (args) {
                if (cb(args))
                    subscription.dispose();
            };
            subscription = this.subscribe(handler);
            if (typeof timeout === 'number')
                setTimeout(function () {
                    return subscription.dispose();
                }, timeout);
            return subscription;
        };

        TestEvent.prototype.unsubscribe = function (cb) {
            this.listenerCtr--;
            this.event.unsubscribe(cb);
        };

        TestEvent.prototype.raise = function (args) {
            this.event.raise(args);
        };

        TestEvent.prototype.clear = function () {
            this.event.clear();
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
