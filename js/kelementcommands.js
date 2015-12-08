define(["require", "exports"], function (require, exports) {
    var OpenEditKElementWindowCommand = (function () {
        function OpenEditKElementWindowCommand(model) {
            this.model = model;
        }
        return OpenEditKElementWindowCommand;
    })();
    exports.OpenEditKElementWindowCommand = OpenEditKElementWindowCommand;
    var UpdateGeneralContentCommand = (function () {
        function UpdateGeneralContentCommand(content, callbacks) {
            this.content = content;
            this.callbacks = callbacks;
        }
        return UpdateGeneralContentCommand;
    })();
    exports.UpdateGeneralContentCommand = UpdateGeneralContentCommand;
    var UpdateContextCommand = (function () {
        function UpdateContextCommand(content, callbacks) {
            this.content = content;
            this.callbacks = callbacks;
        }
        return UpdateContextCommand;
    })();
    exports.UpdateContextCommand = UpdateContextCommand;
});
