define(["require", "exports", 'tests/test', 'frontendtests/reloader', 'frontendtests/webot', '../common', 'comment', 'konsenskistemodel', 'kernaussagemodel'], function(require, exports, test, reloader, webot, common, Comment, koki, ka) {
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
            konsenskiste.id(1);
            konsenskiste.general().title('Konsenskisten-Titel');
            konsenskiste.general().text('Lorem ipsum dolor sit amet');
            konsenskiste.context().text('ipsum (lat.): selbst');

            var kernaussage = new ka.Model();
            konsenskiste.childKas.push(kernaussage);

            model.konsenskiste(konsenskiste);

            kernaussage.id(2);
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
                    oldKoki.id(15);
                    model.konsenskiste(oldKoki);

                    var newKoki = new koki.Model;
                    newKoki.id(15);
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

        Tests.prototype.konsenskisteComments = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    var model = reloader.model();
                    var communicator = reloader.communicator();

                    var serverModel = new koki.Model();
                    serverModel.id(1);
                    var comment = new Comment.Model();
                    comment.content().text('Comment');
                    serverModel.discussion().comments.set([comment]);
                    communicator.konsenskiste.setTestKoki(serverModel);
                    setTimeout(r, 0);
                },
                function (r) {
                    _this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r, 100);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('.cmt').child('*').text('Comment').exists();
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.kernaussageComments = function (cxt, r) {
            var _this = this;
            var serverKa = new ka.Model();
            common.Callbacks.batch([
                function (r) {
                    var model = reloader.model();
                    var communicator = reloader.communicator();
                    serverKa.id(2);
                    var comment = new Comment.Model();
                    comment.content().text('Comment');
                    serverKa.discussion().comments.set([comment]);
                    communicator.konsenskiste.kernaussage.setTestKa(serverKa);
                    setTimeout(r);
                },
                function (r) {
                    _this.webot.query('.ka>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r, 100);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('.cmt').child('*').text('Comment').exists();
                    });

                    var comment2 = new Comment.Model();
                    comment2.content().text('Comment2');
                    serverKa.discussion().comments.push(comment2);
                    _this.webot.query('.ka>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r, 100);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query('.cmt').child('*').text('Comment2').exists(false);
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.commentsLoading = function (cxt, r) {
            var _this = this;
            var model = reloader.model();
            common.Callbacks.batch([
                function (r) {
                    _this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r);
                },
                function (r) {
                    model.konsenskiste().discussion().commentsLoading(true);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () {
                        return _this.webot.query(':contains("Diskussion")').child('*').text('Laden...').exists();
                    });
                    r();
                }
            ], r);
        };

        Tests.prototype.rating = function (cxt, r) {
            var _this = this;
            var ratingButtons = this.webot.query('.kk>.controls .rating input[type="radio"]');
            var ratingLabels = this.webot.query('.kk>.controls .rating input[type="radio"] ~ label');

            common.Callbacks.batch([
                function (r) {
                    test.assert(function () {
                        return ratingLabels.contains('?').exists();
                    });

                    var stronglikeLabel = ratingLabels.contains('++');
                    test.assert(function () {
                        return stronglikeLabel.exists();
                    });

                    stronglikeLabel.click();
                    setTimeout(r, 100);
                },
                function (r) {
                    var stronglikeButton = ratingButtons.contains('++');
                    test.assert(function () {
                        return _this.webot.query('.kk>.controls .rating input[type="radio"]:checked ~ label').contains('++').exists();
                    });
                    r();
                }
            ], r);
        };
        return Tests;
    })();
    exports.Tests = Tests;
});
