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

        Tests.prototype.testKokiContext = function () {
            var _this = this;
            this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('Klärtext aufklappen').click();
            test.assert(function () {
                return _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists();
            });

            this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').click();
            test.assert(function () {
                return _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists(false);
            });
        };

        Tests.prototype.testKaContext = function () {
            var _this = this;
            this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('Klärtext aufklappen').click();
            test.assert(function () {
                return _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists();
            });

            this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').click();
            test.assert(function () {
                return _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists(false);
            });
        };

        Tests.prototype.testKaContent = function () {
            var _this = this;
            test.assert(function () {
                return _this.webot.query('h1').text('Kernaussagen-Titel').exists();
            });
            test.assert(function () {
                return _this.webot.query('*').text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.').exists();
            });
        };
        return Tests;
    })();
    exports.Tests = Tests;
});
