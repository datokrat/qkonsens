define(["require", "exports", 'topicnavigationcontroller', 'frame', 'windows/none', 'windows/konsenskiste', 'windows/konsenskistecontroller'], function(require, exports, topicNavigationCtr, frame, noneWin, kokiWin, kokiWinCtr) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            var _this = this;
            var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation);

            this.kkWin = new kokiWin.Win;
            this.kkWinController = new kokiWinCtr.Controller(model.konsenskiste(), this.kkWin, communicator.konsenskiste);
            this.communicator = communicator;

            model.konsenskiste.subscribe(function (newKoki) {
                return _this.kkWinController.setKonsenskisteModel(newKoki);
            });

            viewModel.left = new frame.WinContainer(new noneWin.Win());
            viewModel.right = new frame.WinContainer(new noneWin.Win());
            viewModel.center = new frame.WinContainer(this.kkWin);
        }
        return Controller;
    })();
    exports.Controller = Controller;
});
