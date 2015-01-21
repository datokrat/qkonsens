define(["require", "exports"], function(require, exports) {
    var QueryState = (function () {
        function QueryState() {
            this.error = ko.observable();
            this.loading = ko.observable();
        }
        QueryState.prototype.set = function (rhs) {
            this.error(rhs.error());
            this.loading(rhs.loading());
        };
        return QueryState;
    })();
    exports.QueryState = QueryState;
});
