var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../topicnavigationcontroller', '../topicnavigationmodel', '../topicnavigationviewmodel', '../observable', '../topic', 'tests/testtopiccommunicator', '../contentmodel', '../konsenskistemodel'], function(require, exports, unit, test, common, ctr, mdl, vm, Obs, Topic, TopicCommunicator, ContentModel, KonsenskisteModel) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.topicFactory = new TopicFactory();
        }
        Tests.prototype.breadcrumbMapping = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);

            model.history.push(this.topicFactory.create('root'));
            model.history.push(this.topicFactory.create('topic'));

            test.assert(function () {
                return viewModel.breadcrumb().length == 1;
            });
            test.assert(function () {
                return viewModel.breadcrumb()[0].caption() == 'root';
            });
            test.assert(function () {
                return viewModel.selected().caption() == 'topic';
            });
        };

        Tests.prototype.children = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);

            test.assert(function () {
                return model.children.get() != null;
            });

            model.children.push(new Topic.Model);
            model.children.get()[0].title('Child Title');

            test.assert(function () {
                return viewModel.children().length == 1;
            });
        };

        Tests.prototype.kokis = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);

            test.assert(function () {
                return model.kokis.get() != null;
            });

            model.kokis.push(new ContentModel.General);
            model.kokis.get()[0].title('KoKi Title');

            test.assert(function () {
                return viewModel.kokis().length == 1;
            });
            test.assert(function () {
                return viewModel.kokis()[0].caption() == 'KoKi Title';
            });
        };

        Tests.prototype.getFromCommunicator = function () {
            var model = new mdl.ModelImpl();
            model.history.push(new Topic.Model);
            model.selectedTopic().id = { id: 3 };
            var communicator = new TopicCommunicator.Main();
            var controller = new ctr.ModelCommunicatorController(model, communicator);

            communicator.childrenReceived.raise({ id: { id: 3 }, children: [new Topic.Model] });
            communicator.containedKokisReceived.raise({ id: { id: 3 }, kokis: [new KonsenskisteModel.Model] });

            test.assert(function () {
                return model.children.get().length == 1;
            });
            test.assert(function (v) {
                return v.val(model.kokis.get().length) == 1;
            });

            //Wrong id - should be ignored
            communicator.containedKokisReceived.raise({ id: { id: 2 }, kokis: [] });
            communicator.childrenReceived.raise({ id: { id: 2 }, children: [] });

            test.assert(function (v) {
                return v.val(model.children.get().length) == 1;
            });
            test.assert(function (v) {
                return v.val(model.kokis.get().length) == 1;
            });
        };

        Tests.prototype.queriesWhenSelectedTopicChanged = function () {
            var counter = new common.Counter();
            var model = new mdl.ModelImpl();
            var communicator = new TopicCommunicator.Stub();
            var controller = new ctr.ModelCommunicatorController(model, communicator);

            communicator.queryChildren = function () {
                return counter.inc('queryChildren');
            };
            communicator.queryContainedKokis = function () {
                return counter.inc('queryContainedKokis');
            };

            var topic = new Topic.Model;
            topic.id = { id: 13 };
            model.history.push(topic);

            test.assert(function () {
                return counter.get('queryChildren') == 1;
            });
            test.assert(function () {
                return counter.get('queryContainedKokis') == 1;
            });
        };

        Tests.prototype.clickChild = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);

            model.history.push(new Topic.Model);
            model.children.set([new Topic.Model]);
            model.children.get(0).title('Child');

            viewModel.children()[0].click.raise();

            test.assert(function () {
                return model.history.get().length == 2;
            });
            test.assert(function () {
                return model.children.get().length == 0;
            });
            test.assert(function () {
                return model.selectedTopic().title() == 'Child';
            });
        };

        Tests.prototype.clickBreadcrumbTopic = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);

            model.history.push(new Topic.Model);
            model.history.get(0).title('Parent');
            model.history.push(new Topic.Model);

            viewModel.breadcrumb()[0].click.raise();

            test.assert(function () {
                return model.history.get().length == 1;
            });
            test.assert(function () {
                return model.selectedTopic().title() == 'Parent';
            });
        };

        Tests.prototype.parentTopicArray = function () {
            var pushCtr = 0, removeCtr = 0, changeCtr = 0;
            var arr = new mdl.ParentTopicArray();
            arr.pushed.subscribe(function () {
                return ++pushCtr;
            });
            arr.removed.subscribe(function () {
                return ++removeCtr;
            });
            arr.changed.subscribe(function () {
                return ++changeCtr;
            });

            var hst = new Obs.ObservableArrayExtender(ko.observableArray([]));
            arr.setHistory(hst);

            test.assert(function () {
                return changeCtr == 1;
            });
            test.assert(function () {
                return pushCtr == 0;
            });
            test.assert(function () {
                return removeCtr == 0;
            });

            pushCtr = 0, removeCtr = 0, changeCtr = 0;
            hst.push(new Topic.Model);

            test.assert(function () {
                return changeCtr == 0;
            });
            test.assert(function () {
                return pushCtr == 0;
            });
            test.assert(function () {
                return removeCtr == 0;
            });

            pushCtr = 0, removeCtr = 0, changeCtr = 0;
            hst.push(new Topic.Model);

            test.assert(function () {
                return changeCtr == 0;
            });
            test.assert(function () {
                return pushCtr == 1;
            });
            test.assert(function () {
                return removeCtr == 0;
            });
        };

        Tests.prototype.root = function () {
            var model = new mdl.ModelImpl();
            var communicator = new TopicCommunicator.Stub();
            var controller = new ctr.ModelCommunicatorController(model, communicator);

            var queryCtr = 0;
            communicator.queryChildren = function (id) {
                ++queryCtr;
            };

            var topic = new Topic.Model();
            topic.id = { id: null, root: true };
            model.history.push(topic);

            test.assert(function () {
                return queryCtr == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var TopicFactory = (function () {
        function TopicFactory() {
        }
        TopicFactory.prototype.create = function (title) {
            var topic = new Topic.Model();
            topic.title(title);
            return topic;
        };
        return TopicFactory;
    })();
});
