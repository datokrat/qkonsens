define(["require", "exports", 'topicnavigationcontroller', 'frame', 'windows/none', 'windows/konsenskiste', 'windows/discussion', 'windows/konsenskistecontroller', 'viewmodelcontext'], function(require, exports, topicNavigationCtr, frame, noneWin, kokiWin, DiscussionWindow, kokiWinCtr, ViewModelContext) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            var _this = this;
            var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation);

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

            this.communicator.konsenskiste.received.subscribe(function (args) {
                if (args.id == model.konsenskiste().id()) {
                    model.konsenskiste(args.konsenskiste);
                }
            });
        }
        Controller.prototype.dispose = function () {
            this.kkWinController.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
