var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', 'frontendtests/reloader', 'frontendtests/webot', '../common', 'windows/browse', '../topic', '../topicnavigationmodel', '../topicnavigationviewmodel'], function(require, exports, unit, test, reloader, webot, common, Win, Topic, TopicNavigationModel, TopicNavigationViewModel) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.webot = new webot.Webot();
        }
        Tests.prototype.view = function (cxt, r) {
            var _this = this;
            var win = new Win.Win();

            common.Callbacks.batch([
                function (r) {
                    win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
                    win.navigation().breadcrumb = ko.observable([]);
                    win.parentTopic = ko.observable(new Topic.ParentViewModel);
                    win.parentTopic().caption = ko.observable('Topic 1');
                    win.parentTopic().description = ko.observable('Description');
                    win.parentTopic().children = ko.observableArray([new Topic.ChildViewModel]);

                    win.parentTopic().children()[0].caption = ko.observable('Child 1');

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

        Tests.prototype.viewMVC = function (cxt, r) {
            var _this = this;
            var topicModel = new Topic.ParentModel();
            var topicViewModel = new Topic.ParentViewModel();
            var topicController = new Topic.ParentController(topicModel, topicViewModel);

            common.Callbacks.batch([
                function (r) {
                    topicModel.properties().title('Parent Title');

                    var win = new Win.Win();
                    win.navigation = ko.observable(new TopicNavigationViewModel.ViewModel);
                    win.navigation().breadcrumb = ko.observableArray([]);
                    win.parentTopic = ko.observable(topicViewModel);

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

        Tests.prototype.navigation = function (cxt, r) {
            var _this = this;
            var win = new Win.Win();
            var topicModel = new Topic.ParentModel();
            var topicViewModel = new Topic.ParentViewModel();
            var topicController = new Topic.ParentController(topicModel, topicViewModel);

            common.Callbacks.batch([
                function (r) {
                    topicModel.properties().title('Parent Title');
                    win.navigation = ko.observable();
                    win.navigation(new TopicNavigationModel.ModelImpl());
                    win.navigation().breadcrumb = ko.observableArray(['Breadcrumb Topic 1']);
                    win.parentTopic = ko.observable(topicViewModel);
                    reloader.viewModel().right.win(win);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('.win:contains("Themen")').child('*').text('Breadcrumb Topic 1').exists();
                    });
                    r();
                }
            ], r);
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
