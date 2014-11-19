define(["require", "exports", 'event'], function(require, exports, Evt) {
    /*export class ParentController {
    constructor(model: ExtendedModel, viewModel: ParentViewModel, communicator: Communicator) {
    this.model = model;
    this.viewModel = viewModel;
    
    this.viewModel.caption = ko.computed<string>(() => this.model.properties().title() || this.getShortenedText());
    this.viewModel.description = ko.computed<string>(() => this.model.properties().title() && this.model.properties().text());
    
    this.viewModel.click = () => {};
    }
    
    private getShortenedText(): string {
    return this.model.properties().text() && this.model.properties().text().substr(0, 255);
    }
    
    public dispose() {
    this.viewModel.caption.dispose();
    this.viewModel.description.dispose();
    this.subscriptions.forEach(s => s.undo());
    }
    
    private model: ExtendedModel;
    private viewModel: ParentViewModel;
    
    private subscriptions: Evt.Subscription[] = [];
    }*/
    var ChildController = (function () {
        function ChildController(model, viewModel) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;

            this.viewModel.caption = ko.computed(function () {
                return _this.model.title() || (_this.model.text() && _this.model.text().substr(0, 255));
            });
            this.viewModel.description = ko.computed(function () {
                return _this.model.title() && _this.model.text();
            });
            this.viewModel.click = new Evt.EventImpl();
        }
        ChildController.prototype.dispose = function () {
            this.viewModel.caption.dispose();
            this.viewModel.description.dispose();
        };
        return ChildController;
    })();
    exports.ChildController = ChildController;

    /*export class ExtendedModel {
    public properties = ko.observable<Model>(new Model);
    public children: Obs.ObservableArrayEx<Model> = new Obs.ObservableArrayExtender(ko.observableArray<Model>());
    
    public set(other: ExtendedModel): ExtendedModel {
    this.properties().set(other.properties());
    this.children.set(other.children.get().map(child => new Model().set(child)));
    return this;
    }
    }*/
    var Model = (function () {
        function Model() {
            //public parent = ko.observable<Model>();
            //public children = ko.observableArray<TopicModel>();
            //public kks = ko.observableArray<Konsenskiste>();
            this.title = ko.observable();
            this.text = ko.observable();
        }
        Model.prototype.set = function (other) {
            this.title(other.title());
            this.text(other.text());
            this.id = other.id;
            return this;
        };
        return Model;
    })();
    exports.Model = Model;

    /*export class ParentViewModel {
    public caption: Obs.Observable<string>;
    public description: Obs.Observable<string>;
    //public children: Obs.ObservableArray<ViewModel>;
    
    public click: () => void;
    }*/
    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
