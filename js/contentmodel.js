var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'contextmodel'], function(require, exports, Context) {
    var Model = (function () {
        function Model() {
            this.title = ko.observable();
            this.text = ko.observable();
        }
        Model.prototype.set = function (content) {
            this.title(content.title());
            this.text(content.text());
        };
        return Model;
    })();
    exports.Model = Model;

    var WithContext = (function (_super) {
        __extends(WithContext, _super);
        function WithContext() {
            _super.apply(this, arguments);
            this.context = ko.observable(new Context);
        }
        WithContext.prototype.set = function (content) {
            Model.prototype.set.call(this, content);

            if (content instanceof WithContext) {
                var withContext = content;
                this.context(withContext.context());
            }
        };
        return WithContext;
    })(Model);
    exports.WithContext = WithContext;
});
