var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../windows', '../kokilogic', '../topicnavigationcontroller', '../topicnavigationmodel', '../topicnavigationviewmodel', '../topic', 'tests/testtopiccommunicator', '../contentmodel', '../konsenskistemodel', '../command'], function (require, exports, unit, test, common, Windows, KokiLogic, ctr, mdl, vm, Topic, TopicCommunicator, ContentModel, KonsenskisteModel, Commands) {
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
            test.assert(function () { return viewModel.breadcrumb().length == 1; });
            test.assert(function () { return viewModel.breadcrumb()[0].caption() == 'root'; });
            test.assert(function () { return viewModel.selected().caption() == 'topic'; });
        };
        Tests.prototype.children = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);
            test.assert(function () { return model.children.items.get() != null; });
            model.children.items.push(new Topic.Model);
            model.children.items.get()[0].title('Child Title');
            test.assert(function () { return viewModel.children.items().length == 1; });
        };
        Tests.prototype.kokis = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);
            test.assert(function () { return model.kokis.items.get() != null; });
            model.kokis.items.push(new KonsenskisteModel.Model);
            model.kokis.items.get(0).general(new ContentModel.General);
            model.kokis.items.get(0).general().title('KoKi Title');
            test.assert(function () { return viewModel.kokis.items().length == 1; });
            test.assert(function () { return viewModel.kokis.items()[0].caption() == 'KoKi Title'; });
        };
        Tests.prototype.getFromCommunicator = function () {
            var counter = new common.Counter();
            var model = new mdl.ModelImpl();
            model.history.push(new Topic.Model);
            model.selectedTopic().id = { id: 3 };
            var communicator = new TopicCommunicator.Main();
            var controller = new ctr.ModelCommunicatorController(model, communicator);
            communicator.queryChildren = function (id, out) {
                counter.inc('queryChildren');
                test.assert(function (v) { return out == model.children; });
            };
            communicator.queryContainedKokis = function (id, out) {
                counter.inc('queryContainedKokis');
                test.assert(function (v) { return out == model.kokis; });
            };
            model.selectChild(new Topic.Model);
            test.assert(function (v) { return v.val(counter.get('queryChildren')) == 1; });
            test.assert(function (v) { return v.val(counter.get('queryContainedKokis')) == 1; });
        };
        Tests.prototype.queriesWhenSelectedTopicChanged = function () {
            var counter = new common.Counter();
            var model = new mdl.ModelImpl();
            var communicator = new TopicCommunicator.Stub();
            var controller = new ctr.ModelCommunicatorController(model, communicator);
            communicator.queryChildren = function () { return counter.inc('queryChildren'); };
            communicator.queryContainedKokis = function () { return counter.inc('queryContainedKokis'); };
            var topic = new Topic.Model;
            topic.id = { id: 13 };
            model.history.push(topic);
            test.assert(function () { return counter.get('queryChildren') == 1; });
            test.assert(function () { return counter.get('queryContainedKokis') == 1; });
        };
        Tests.prototype.clickChild = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);
            model.history.push(new Topic.Model);
            model.children.items.set([new Topic.Model]);
            model.children.items.get(0).title('Child');
            viewModel.children.items()[0].click();
            test.assert(function () { return model.history.get().length == 2; });
            test.assert(function () { return model.children.items.get().length == 0; });
            test.assert(function () { return model.selectedTopic().title() == 'Child'; });
        };
        Tests.prototype.clickKoki = function () {
            var counter = new common.Counter();
            var commandControl = { commandProcessor: new Commands.CommandProcessor };
            commandControl.commandProcessor.chain.append(function (cmd) {
                counter.inc('command');
                test.assert(function () { return cmd instanceof KokiLogic.SelectAndLoadKokiCommand; });
                var castCmd = cmd;
                test.assert(function () { return castCmd.id == 3; });
                return true;
            });
            var kokiModel = new KonsenskisteModel.Model();
            kokiModel.id(3);
            var kokiViewModel = new vm.KokiItem();
            var kokiController = new ctr.KokiItemViewModelController(kokiModel, kokiViewModel, commandControl);
            kokiViewModel.click();
            test.assert(function () { return counter.get('command') == 1; });
        };
        Tests.prototype.receiveCommandToSelectKoki = function () {
            var counter = new common.Counter();
            var commandProcessor = new Commands.CommandProcessor;
            commandProcessor.chain.append(function (cmd) {
                counter.inc('command');
                test.assert(function () { return cmd instanceof KokiLogic.SelectAndLoadKokiCommand; });
                var castCmd = cmd;
                test.assert(function () { return castCmd.id == 3; });
                return true;
            });
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel, commandProcessor);
            var cmd = new KokiLogic.SelectAndLoadKokiCommand(3);
            controller.kokiCommandControl.commandProcessor.processCommand(cmd);
            test.assert(function () { return counter.get('command') == 1; });
        };
        Tests.prototype.clickBreadcrumbTopic = function () {
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel);
            model.history.push(new Topic.Model);
            model.history.get(0).title('Parent');
            model.history.push(new Topic.Model);
            viewModel.breadcrumb()[0].click();
            test.assert(function () { return model.history.get().length == 1; });
            test.assert(function () { return model.selectedTopic().title() == 'Parent'; });
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
            test.assert(function () { return queryCtr == 1; });
        };
        Tests.prototype.newKoki = function () {
            var counter = new common.Counter();
            var commandProcessor = new Commands.CommandProcessor();
            var model = new mdl.ModelImpl();
            var viewModel = new vm.ViewModel();
            var controller = new ctr.ModelViewModelController(model, viewModel, commandProcessor);
            var topic = new Topic.Model();
            topic.title('Parent Topic wr,s');
            model.history.push(topic);
            commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof Windows.OpenNewKokiWindowCommand) {
                    counter.inc('openNewKokiWindow command');
                    var openNewKokiWindow = cmd;
                    test.assert(function (v) { return v.val(openNewKokiWindow.topic.title()) == 'Parent Topic wr,s'; });
                    return true;
                }
                return false;
            });
            viewModel.clickCreateNewKoki();
            test.assert(function (v) { return v.val(counter.get('openNewKokiWindow command')) == 1; });
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
