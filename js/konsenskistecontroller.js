define(["require", "exports", 'kernaussageviewmodel', 'kernaussagecontroller'], function(require, exports, kernaussageVm, kernaussageCtr) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            var _this = this;
            this.childKaViewModels = ko.observableArray();
            this.model = model;
            this.viewModel = viewModel;

            model.childKaInserted.subscribe(function (args) {
                return _this.onChildKaInserted(args.childKa);
            });
            model.childKaRemoved.subscribe(function (args) {
                return _this.onChildKaRemoved(args.childKa);
            });

            viewModel.childKas = this.childKaViewModels;
        }
        Controller.prototype.getChildKaArray = function () {
            return this.model.getChildKaArray();
        };

        Controller.prototype.onChildKaInserted = function (kaMdl) {
            var kaVm = new kernaussageVm.ViewModel();
            var kaCtr = new kernaussageCtr.Controller(kaMdl, kaVm);

            this.childKaViewModels.push(kaVm);
        };

        Controller.prototype.onChildKaRemoved = function (kaMdl) {
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
