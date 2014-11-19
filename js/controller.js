define(["require", "exports", 'topicnavigationcontroller', 'locationhash', 'frame', 'windows/none', 'windows/konsenskiste', 'windows/discussion', 'windows/konsenskistecontroller', 'viewmodelcontext'], function(require, exports, topicNavigationCtr, LocationHash, frame, noneWin, kokiWin, DiscussionWindow, kokiWinCtr, ViewModelContext) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            var _this = this;
            this.subscriptions = [];
            var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation, communicator.topic);

            this.kkWin = new kokiWin.Win();

            viewModel.left = new frame.WinContainer(new noneWin.Win());
            viewModel.right = new frame.WinContainer(new noneWin.Win());
            viewModel.center = new frame.WinContainer(this.kkWin);

            var globalContext = new ViewModelContext(viewModel.left, viewModel.right, viewModel.center);
            globalContext.konsenskisteWindow = this.kkWin;
            globalContext.discussionWindow = new DiscussionWindow.Win();
            globalContext.konsenskisteModel = model.konsenskiste;

            this.kkWinController = new kokiWinCtr.Controller(model.konsenskiste(), this.kkWin, communicator.konsenskiste).setContext(globalContext);

            this.communicator = communicator;

            model.konsenskiste.subscribe(function (newKoki) {
                return _this.kkWinController.setKonsenskisteModel(newKoki);
            });

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
                return s.undo();
            });
        };

        Controller.prototype.onHashChanged = function () {
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
