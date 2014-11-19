define(["require", "exports", '../topic'], function(require, exports, Topic) {
    var Main = (function () {
        function Main() {
        }
        Main.create = function (args) {
            var ret = new Topic.Model();
            ret.id = args.id;
            ret.title(args.title);
            ret.title(args.text);
            return ret;
        };
        return Main;
    })();
    exports.Main = Main;
});
