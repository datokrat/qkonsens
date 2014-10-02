define(["require", "exports", 'event'], function(require, exports, Events) {
    var General = (function () {
        function General(model, viewModel, communicator) {
            var _this = this;
            this.onContentRetrieved = function (args) {
                if (_this.model.id == args.general.id)
                    _this.model.set(args.general);
            };
            this.init(model, viewModel, communicator);
        }
        General.prototype.init = function (model, viewModel, communicator) {
            this.viewModel = viewModel;
            this.model = model;
            this.communicator = communicator;

            this.viewModel.title = ko.computed(function () {
                return model.title();
            });
            this.viewModel.text = ko.computed(function () {
                return model.text();
            });

            this.communicator.generalContentRetrieved.subscribe(this.onContentRetrieved);
        };

        General.prototype.dispose = function () {
            this.viewModel.title.dispose();
            this.viewModel.text.dispose();
            this.communicator.generalContentRetrieved.unsubscribe(this.onContentRetrieved);
        };
        return General;
    })();
    exports.General = General;

    var Context = (function () {
        function Context(model, viewModel, communicator) {
            var _this = this;
            this.onUpdateRetrieved = function (args) {
                if (_this.model.id == args.context.id)
                    _this.model.set(args.context);
            };
            this.model = model;
            this.viewModel = viewModel;

            this.viewModel.text = ko.computed(function () {
                return model.text();
            });
            this.viewModel.isVisible = ko.observable(false);

            this.viewModel.toggleVisibility = new Events.EventImpl();
            this.viewModel.toggleVisibility.subscribe(function () {
                return _this.toggleVisibility();
            });

            this.communicator = communicator;
            this.communicator.contextRetrieved.subscribe(this.onUpdateRetrieved);
        }
        Context.prototype.toggleVisibility = function () {
            var isVisible = this.viewModel.isVisible();
            this.viewModel.isVisible(!isVisible);
        };

        Context.prototype.dispose = function () {
            this.viewModel.text.dispose();
            this.communicator.contextRetrieved.unsubscribe(this.onUpdateRetrieved);
        };
        return Context;
    })();
    exports.Context = Context;
});
