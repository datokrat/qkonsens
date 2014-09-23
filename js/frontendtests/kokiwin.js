define(["require", "exports", 'tests/test', 'frontendtests/reloader', 'frontendtests/webot', '../common', 'konsenskistemodel', 'kernaussagemodel'], function(require, exports, test, reloader, webot, common, koki, ka) {
    ko = top.frames[2].ko;

    var Tests = (function () {
        function Tests() {
            this.webot = new webot.Webot;
        }
        Tests.prototype.setUp = function (r) {
            var model = reloader.model();
            var viewModel = reloader.viewModel();
            var controller = reloader.controller();
            var communicator = reloader.communicator();

            var konsenskiste = new koki.Model;
            konsenskiste.general().title('Konsenskisten-Titel');
            konsenskiste.general().text('Lorem ipsum dolor sit amet');
            konsenskiste.context().text('ipsum (lat.): selbst');
            model.konsenskiste(konsenskiste);

            var kernaussage = new ka.Model();
            konsenskiste.appendKa(kernaussage);

            kernaussage.general().title('Kernaussagen-Titel');
            kernaussage.general().text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');
            kernaussage.context().text('blablablablub');
            setTimeout(r, 0);
        };

        Tests.prototype.testTitle = function (cxt, r) {
            var _this = this;
            test.assert(function () {
                return _this.webot.query('h1').text('Konsenskiste').exists();
            });
            r();
        };

        Tests.prototype.testDocumentView = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    _this.webot.query('*').text('wechseln').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('*').text('Dokumentansicht').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('*').text('Detailansicht').exists(false);
                    });
                    _this.webot.queryContains('a', 'wechseln').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('*').text('Detailansicht').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('*').text('Dokumentansicht').exists(false);
                    });
                    r();
                }
            ], function (err) {
                console.log(err);
                r(err);
            });
        };

        Tests.prototype.testKokiContent = function (cxt, r) {
            var _this = this;
            test.assert(function () {
                return _this.webot.query('h1').text('Konsenskisten-Titel').exists();
            });
            test.assert(function () {
                return _this.webot.query('*').text('Lorem ipsum dolor sit amet').exists();
            });
            r();
        };

        Tests.prototype.testKokiContext = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('Klärtext aufklappen').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists();
                    });
                    _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists(false);
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.testKaContext = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('Klärtext aufklappen').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists();
                    });

                    _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists(false);
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.testKaContent = function (cxt, r) {
            var _this = this;
            test.assert(function () {
                return _this.webot.query('h1').text('Kernaussagen-Titel').exists();
            });
            test.assert(function () {
                return _this.webot.query('*').text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.').exists();
            });
            r();
        };

        Tests.prototype.testCommunicator = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    var model = reloader.model();
                    var oldKoki = new koki.Model;
                    oldKoki.id = 15;
                    model.konsenskiste(oldKoki);

                    var newKoki = new koki.Model;
                    newKoki.id = 15;
                    newKoki.general().title('New Title');
                    newKoki.general().text('New Text');

                    var com = reloader.communicator();
                    com.konsenskiste.received.raise({ id: 15, konsenskiste: newKoki });
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('h1').text('New Title').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('*').text('New Text').exists();
                    });
                    test.assert(function () {
                        return _this.webot.query('*').text('Klärtext aufklappen').exists(false);
                    });
                    r();
                }
            ], r);
        };
        return Tests;
    })();
    exports.Tests = Tests;
});
