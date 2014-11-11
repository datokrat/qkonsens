define(["require", "exports", 'discocontext'], function(require, exports, discoContext) {
    var DiscoHelper = (function () {
        function DiscoHelper() {
        }
        DiscoHelper.post = function () {
            return PostHelper;
        };
        return DiscoHelper;
    })();
    exports.DiscoHelper = DiscoHelper;

    var PostHelper = (function () {
        function PostHelper() {
        }
        PostHelper.querySingle = function (id) {
            discoContext.Posts.first(function (it) {
                return it.Id == this.id;
            }, { id: id }).fail(HelperOptions.onError);
        };
        return PostHelper;
    })();
    exports.PostHelper = PostHelper;

    var HelperOptions = (function () {
        function HelperOptions() {
        }
        HelperOptions.onError = function () {
            discoContext['stateManager'].reset();
        };
        return HelperOptions;
    })();
});
