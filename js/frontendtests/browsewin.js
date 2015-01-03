var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', 'frontendtests/reloader', 'frontendtests/webot', '../common', '../event', 'windows/browse', '../topic', 'factories/topic', 'tests/testtopiccommunicator', '../topicnavigationmodel', '../topicnavigationviewmodel', '../topicnavigationcontroller', '../konsenskisteviewmodel', '../contentviewmodel'], function(require, exports, unit, test, reloader, webot, common, Evt, Win, Topic, TopicFactory, TopicCommunicator, TopicNavigationModel, TopicNavigationViewModel, TopicNavigationController, KonsenskisteViewModel, ContentViewModel) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.webot = new webot.Webot();
        }
        Tests.prototype.view = function (async, r) {
            var _this = this;
            async();
            var win = new Win.Win();

            common.Callbacks.batch([
                function (r) {
                    win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
                    win.navigation().breadcrumb = ko.observableArray([]);
                    win.navigation().selected = ko.observable(new Topic.ViewModel);
                    win.navigation().selected().caption = ko.observable('Topic 1');
                    win.navigation().selected().description = ko.observable('Description');

                    win.navigation().children = ko.observableArray([new Topic.ViewModel]);
                    win.navigation().children()[0].caption = ko.observable('Child 1');
                    win.navigation().children()[0].click = new Evt.EventImpl();

                    reloader.viewModel().right.win(win);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('.win:contains("Themen")').child('*').text('Topic 1').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('.win:contains("Themen")').child('*').text('Description').exists();
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.viewMVC = function (async, r) {
            var _this = this;
            async();
            var topicModel = new Topic.Model();
            var topicViewModel = new Topic.ViewModel();
            var topicController = new Topic.ModelViewModelController(topicModel, topicViewModel);

            common.Callbacks.batch([
                function (r) {
                    topicModel.title('Parent Title');

                    var win = new Win.Win();
                    win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
                    win.navigation().breadcrumb = ko.observableArray([]);
                    win.navigation().selected = ko.observable(topicViewModel);
                    win.navigation().children = ko.observableArray([]);

                    reloader.viewModel().right.win(win);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('.win').child('*').text('Parent Title').exists();
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.navigation = function (async, r) {
            var _this = this;
            async();
            var win = new Win.Win();
            var topicModel = new Topic.Model();
            var topicViewModel = new Topic.ViewModel();
            var topicController = new Topic.ModelViewModelController(topicModel, topicViewModel);

            common.Callbacks.batch([
                function (r) {
                    topicModel.title('Parent Title');
                    win.navigation = ko.observable();
                    win.navigation(new TopicNavigationViewModel.ViewModel());
                    win.navigation().breadcrumb = ko.observableArray([new Topic.ViewModel]);
                    win.navigation().breadcrumb()[0].caption = ko.observable('Breadcrumb Topic 1');
                    win.navigation().breadcrumb()[0].click = new Evt.EventImpl();
                    win.navigation().selected = ko.observable(topicViewModel);
                    win.navigation().children = ko.observableArray([]);
                    win.navigation().kokis = ko.observableArray([new KonsenskisteViewModel.ViewModel]);
                    win.navigation().kokis()[0].general = ko.observable(new ContentViewModel.General);
                    win.navigation().kokis()[0].general().title = ko.observable('KoKi im Thema');
                    reloader.viewModel().right.win(win);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('.win:contains("Themen")').child('*').text('Breadcrumb Topic 1').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('.win:contains("Themen")').child('*').text('KoKi im Thema').exists();
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.navigationUseCase = function (async, r) {
            var _this = this;
            async();
            var win = new Win.Win();
            var topicCommunicator = new TopicCommunicator.Main();
            var topicNavigationModel = new TopicNavigationModel.ModelImpl();
            var topicNavigationViewModel = new TopicNavigationViewModel.ViewModel();
            var topicNavigationController = new TopicNavigationController.Controller(topicNavigationModel, topicNavigationViewModel, topicCommunicator);

            topicCommunicator.setTestChildren({ id: 3 }, [TopicFactory.Main.create({ id: 5, text: 'Topic 5' })]);

            var topic0 = TopicFactory.Main.create({ id: 0, text: 'Topic 0' });
            var topic3 = TopicFactory.Main.create({ id: 3, text: 'Topic 3' });
            topicNavigationModel.history.set([topic3, topic0]);

            win.navigation = ko.observable(topicNavigationViewModel);
            common.Callbacks.batch([
                function (r) {
                    reloader.viewModel().right.win(win);
                    setTimeout(r);
                }, function (r) {
                    _this.webot.query('.win').contains('Themen').child('*').text('Topic 3').click();
                    setTimeout(r);
                }, function (r) {
                    test.assert(function () {
                        return _this.webot.query('.win').contains('Themen').child('*').text('Topic 3').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('.win').contains('Themen').child('*').text('Topic 5').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('.win').contains('Themen').child('*').text('Topic 0').exists(false);
                    });
                    r();
                }
            ], r);
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
