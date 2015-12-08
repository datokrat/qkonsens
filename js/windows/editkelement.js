var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../frame', '../kelementcommands', '../contentmodel'], function (require, exports, frame, KElementCommands, ContentModel) {
    var Main = (function () {
        function Main() {
        }
        Main.CreateEmpty = function (commandProcessor) {
            var ret = new Main;
            ret.data = new Data;
            ret.model = new Model(ret.data, commandProcessor);
            ret.frame = new Win(ret.model, ret.data);
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
        function Win(model, data) {
            var _this = this;
            _super.call(this, 'editkelement-win-template', null);
            this.model = model;
            this.submitGeneralContent = function () { return _this.model.submitGeneralContent(); };
            this.submitContext = function () { return _this.model.submitContext(); };
            this.title = data.title;
            this.text = data.text;
            this.context = data.context;
        }
        return Win;
    })(frame.Win);
    exports.Win = Win;
    var Model = (function () {
        function Model(data, commandProcessor) {
            this.data = data;
            this.commandProcessor = commandProcessor;
        }
        Model.prototype.setKElementModel = function (kElement) {
            this.kElement = kElement;
            this.data.title(kElement.general().title());
            this.data.text(kElement.general().text());
            this.data.context(kElement.context().text());
        };
        Model.prototype.submitGeneralContent = function () {
            var _this = this;
            var newContent = new ContentModel.General();
            newContent.set(this.kElement.general());
            newContent.title(this.data.title());
            newContent.text(this.data.text());
            var cmd = new KElementCommands.UpdateGeneralContentCommand(newContent, { then: function () {
                    _this.kElement.general().title(_this.data.title());
                    _this.kElement.general().text(_this.data.text());
                } });
            this.commandProcessor.processCommand(cmd);
        };
        Model.prototype.submitContext = function () {
            var _this = this;
            var newContext = new ContentModel.Context();
            newContext.set(this.kElement.context());
            newContext.text(this.data.context());
            var cmd = new KElementCommands.UpdateContextCommand(newContext, { then: function () {
                    _this.kElement.context().text(_this.data.context()); //Is it possible to generalize this procedure of updating?
                } });
            this.commandProcessor.processCommand(cmd);
        };
        Model.prototype.dispose = function () {
        };
        return Model;
    })();
    exports.Model = Model;
    var Data = (function () {
        function Data() {
            this.title = ko.observable();
            this.text = ko.observable();
            this.context = ko.observable();
        }
        return Data;
    })();
    exports.Data = Data;
});
