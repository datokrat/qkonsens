var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../frame', '../controller', '../kokilogic'], function (require, exports, frame, MainController, KokiLogic) {
    var Main = (function () {
        function Main() {
        }
        Main.CreateEmpty = function (commandProcessor) {
            var ret = new Main;
            ret.model = new Model(commandProcessor);
            ret.frame = new Win(ret.model);
            return ret;
        };
        Main.prototype.dispose = function () {
            this.model.dispose();
        };
        return Main;
    })();
    exports.Main = Main;
    var Win = (function (_super) {
        __extends(Win, _super);
        function Win(model) {
            var _this = this;
            _super.call(this, 'newkk-win-template', null);
            this.model = model;
            this.clickSubmit = function () {
                _this.model.onClickSubmit();
            };
            this.state('ok');
            this.parentName = this.model.getParentNameObservable();
            this.title = this.model.getKokiData().title;
            this.text = this.model.getKokiData().text;
        }
        return Win;
    })(frame.Win);
    exports.Win = Win;
    var Model = (function () {
        function Model(commandProcessor) {
            var _this = this;
            this.commandProcessor = commandProcessor;
            this.kokiData = new KonsenskisteData();
            this.parentTopic = ko.observable();
            this.parentName = ko.computed(function () { return _this.parentTopic() && (_this.parentTopic().title() || _this.parentTopic().text()); });
        }
        Model.prototype.onClickSubmit = function () {
            var _this = this;
            this.commandProcessor.processCommand(new MainController.CreateNewKokiCommand({ title: this.kokiData.title(), text: this.kokiData.text() }, this.parentTopic().id, function (id) { return _this.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(id)); }));
        };
        Model.prototype.getKokiData = function () {
            return this.kokiData;
        };
        Model.prototype.getParentNameObservable = function () {
            return this.parentName;
        };
        Model.prototype.setParentTopic = function (parentTopic) {
            this.parentTopic(parentTopic);
            this.kokiData.clear();
        };
        Model.prototype.dispose = function () {
            this.parentName.dispose();
        };
        return Model;
    })();
    exports.Model = Model;
    var KonsenskisteData = (function () {
        function KonsenskisteData(title, text) {
            if (title === void 0) { title = ""; }
            if (text === void 0) { text = ""; }
            this.title = ko.observable();
            this.text = ko.observable();
            this.title(title);
            this.text(text);
        }
        KonsenskisteData.prototype.set = function (other) {
            this.title(other.title());
            this.text(other.text());
            return this;
        };
        KonsenskisteData.prototype.clear = function () {
            this.title('');
            this.text('');
        };
        return KonsenskisteData;
    })();
    exports.KonsenskisteData = KonsenskisteData;
});
