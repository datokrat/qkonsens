define(["require", "exports", 'topicnavigationcontroller', 'locationhash', 'frame', 'windows/none', 'windows/konsenskiste', 'windows/browse', 'windows/discussion', 'windows/konsenskistecontroller', 'viewmodelcontext', 'topic', 'command'], function(require, exports, topicNavigationCtr, LocationHash, frame, noneWin, KokiWin, BrowseWin, DiscussionWindow, kokiWinCtr, ViewModelContext, Topic, Commands) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator, commandControl) {
            var _this = this;
            this.commandControl = { commandProcessor: new Commands.CommandProcessor() };
            this.subscriptions = [];
            /*var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation, { communicator: communicator.topic });*/
            this.initCommandControl(commandControl);

            this.kkWin = new KokiWin.Win();
            this.browseWin = new BrowseWin.Win();

            viewModel.left = new frame.WinContainer(new noneWin.Win());
            viewModel.right = new frame.WinContainer(this.browseWin);
            viewModel.center = new frame.WinContainer(this.kkWin);
            viewModel.browseWin = this.browseWin;
            viewModel.kkWin = this.kkWin;

            var globalContext = new ViewModelContext(viewModel.left, viewModel.right, viewModel.center);
            globalContext.konsenskisteWindow = this.kkWin;
            globalContext.discussionWindow = new DiscussionWindow.Win();
            globalContext.konsenskisteModel = model.konsenskiste;

            this.kkWinController = new kokiWinCtr.Controller(model.konsenskiste(), this.kkWin, communicator.konsenskiste).setContext(globalContext);

            this.browseWinController = new BrowseWin.Controller(model.topicNavigation, this.browseWin, communicator.topic, this.commandControl);

            this.communicator = communicator;

            model.konsenskiste.subscribe(function (newKoki) {
                return _this.kkWinController.setKonsenskisteModel(newKoki);
            });

            var rootTopic = new Topic.Model();
            rootTopic.id = { root: true, id: undefined };
            rootTopic.text('[root]');
            model.topicNavigation.history.push(rootTopic);

            this.kkWin.state.subscribe(function (state) {
                return LocationHash.set(JSON.stringify(state), false);
            });
            this.subscriptions = [LocationHash.changed.subscribe(function () {
                    return _this.onHashChanged();
                })];
            this.onHashChanged();
        }
        Controller.prototype.dispose = function () {
            this.kkWinController.dispose();
            this.subscriptions.forEach(function (s) {
                return s.dispose();
            });
        };

        Controller.prototype.initCommandControl = function (parent) {
            var _this = this;
            this.commandControl.commandProcessor.parent = parent && parent.commandProcessor;
            this.commandControl.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof topicNavigationCtr.SelectKokiCommand) {
                    _this.kkWinController.setKonsenskisteModelById(cmd.model.id());
                    return true;
                }
                return false;
            });
        };

        Controller.prototype.onHashChanged = function () {
            console.log('onHashChanged');
            var hash = LocationHash.get().slice(1);
            try  {
                var hashObj = JSON.parse(hash);
                this.kkWin.setState(hashObj || { kokiId: 12 });
            } catch (e) {
                this.kkWin.setState({ kokiId: 12 });
            }
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
