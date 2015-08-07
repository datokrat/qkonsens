define(["require", "exports", 'topic', 'windows', 'windows/browse'], function(require, exports, Topic, Windows, BrowseWin) {
    var Controller = (function () {
        function Controller(resources) {
            this.resources = resources;

            this.initTopicNavigation();
            this.initBrowseWin();
        }
        Controller.prototype.dispose = function () {
            this.browseWinController.dispose();
        };

        Controller.prototype.initTopicNavigation = function () {
            var rootTopic = new Topic.Model();
            rootTopic.id = { root: true, id: undefined };
            rootTopic.text('[root]');
            this.resources.topicNavigationModel.history.push(rootTopic);
        };

        Controller.prototype.initBrowseWin = function () {
            this.browseWin = new BrowseWin.Win();
            this.browseWinController = new BrowseWin.Controller(this.resources.topicNavigationModel, this.browseWin, this.resources.topicCommunicator, this.resources.commandProcessor);

            this.resources.windowViewModel.fillFrameWithWindow(2 /* Right */, this.browseWin);
        };
        return Controller;
    })();
    exports.Controller = Controller;

    var Resources = (function () {
        function Resources() {
        }
        return Resources;
    })();
    exports.Resources = Resources;
});
