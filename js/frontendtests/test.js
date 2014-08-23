define(["require", "exports", 'tests/test', 'frontendtests/webot'], function(require, exports, test, webot) {
    var Tests = (function () {
        function Tests() {
            this.webot = new webot.Webot;
        }
        Tests.prototype.test = function () {
            var _this = this;
            this.webot.query('a:contains("wechseln")').click();

            test.assert(function () {
                return _this.webot.queryContains('span', 'Dokumentansicht').length() == 1;
            });
        };
        return Tests;
    })();
    exports.Tests = Tests;
});
