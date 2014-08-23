define(["require", "exports", 'contentmodel'], function(require, exports, Content) {
    var Model = (function () {
        function Model() {
            this.content = new Content.WithContext();
        }
        return Model;
    })();
    exports.Model = Model;
});
