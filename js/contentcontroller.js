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
        function Context(model, viewModel) {
            var _this = this;
            this.viewModel = viewModel;

            this.viewModel.text = ko.computed(function () {
                return model.text();
            });
            this.viewModel.isVisible = ko.observable(false);

            this.viewModel.toggleVisibility = new Events.EventImpl();
            this.viewModel.toggleVisibility.subscribe(function () {
                return _this.toggleVisibility();
            });
        }
        Context.prototype.toggleVisibility = function () {
            var isVisible = this.viewModel.isVisible();
            this.viewModel.isVisible(!isVisible);
        };

        Context.prototype.dispose = function () {
            this.viewModel.text.dispose();
        };
        return Context;
    })();
    exports.Context = Context;
});
/*export class WithContext extends Controller {
constructor(model: mdl.WithContext, viewModel: vm.WithContext, communicator: Communicator.Main) {
super(model, viewModel, communicator);
this.initContext(model, viewModel);
}
private initContext(model: mdl.WithContext, viewModel: vm.WithContext) {
this.viewModelWithContext = viewModel;
this.modelWithContext = model;
this.viewModelWithContext.context = ko.observable<ContextViewModel>( new ContextViewModel );
var contextModel = this.modelWithContext.context();
var contextViewModel = this.viewModelWithContext.context();
var contextController = new ContextController( contextModel, contextViewModel );
this.context = contextController;
}
public dispose() {
Controller.prototype.dispose.apply(this, arguments);
this.context.dispose();
}
private viewModelWithContext: vm.WithContext;
private modelWithContext: mdl.WithContext;
private context: ContextController;
}*/
