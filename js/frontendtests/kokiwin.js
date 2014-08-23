define(["require", "exports", 'tests/test', 'frontendtests/webot'], function(require, exports, test, webot) {
    var Tests = (function () {
        function Tests() {
            this.webot = new webot.Webot;
        }
        Tests.prototype.testTitle = function () {
            var _this = this;
            test.assert(function () {
                return _this.webot.query('h1').text('Konsenskiste').exists();
            });
        };

        Tests.prototype.testDocumentView = function () {
            var _this = this;
            this.webot.query('*').text('wechseln').click();

            test.assert(function () {
                return _this.webot.query('*').text('Dokumentansicht').exists();
            });
            test.assert(function () {
                return _this.webot.query('*').text('Detailansicht').exists(false);
            });

            this.webot.queryContains('a', 'wechseln').click();

            test.assert(function () {
                return _this.webot.query('*').text('Detailansicht').exists();
            });
            test.assert(function () {
                return _this.webot.query('*').text('Dokumentansicht').exists(false);
            });
        };

        Tests.prototype.testKokiContent = function () {
            var _this = this;
            test.assert(function () {
                return _this.webot.query('h1').text('Konsenskisten-Titel').exists();
            });
            test.assert(function () {
                return _this.webot.query('*').text('Lorem ipsum dolor sit amet').exists();
            });
        };

        Tests.prototype.testKaContent = function () {
            var _this = this;
            test.assert(function () {
                return _this.webot.query('h1').text('Kernaussagen-Titel').exists();
            });
        };
        return Tests;
    })();
    exports.Tests = Tests;
});
