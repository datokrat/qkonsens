define(["require", "exports", 'tests/test', 'frontendtests/reloader', 'frontendtests/webot', '../common', 'comment', '../konsenskistemodel', '../kernaussagemodel', '../kokilogic'], function (require, exports, test, reloader, webot, common, Comment, KonsenskisteModel, KernaussageModel, KokiLogic) {
    ko = top.frames[2]['ko'];
    var Tests = (function () {
        function Tests() {
            this.webot = new webot.Webot();
        }
        Tests.prototype.setUp = function (r) {
            this.helper = new Helper(this.webot);
            var model = reloader.model();
            var viewModel = reloader.viewModel();
            var controller = reloader.controller();
            var communicator = reloader.communicator();
            var konsenskiste = new KonsenskisteModel.Model;
            konsenskiste.id(1);
            konsenskiste.general().title('Konsenskisten-Titel');
            konsenskiste.general().text('Lorem ipsum dolor sit amet');
            konsenskiste.context().text('ipsum (lat.): selbst');
            var kernaussage = new KernaussageModel.Model();
            konsenskiste.childKas.push(kernaussage);
            controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(konsenskiste));
            kernaussage.id(2);
            kernaussage.general().title('Kernaussagen-Titel');
            kernaussage.general().text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');
            kernaussage.context().text('blablablablub');
            setTimeout(r, 0);
        };
        Tests.prototype.testTitle = function (asnyc, r) {
            var _this = this;
            test.assert(function () { return _this.webot.query('h1').text('Konsenskiste').exists(); });
        };
        Tests.prototype.testDocumentView = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.webot.query('*').text('wechseln').click();
                    setTimeout(r, 100);
                },
                function (r) {
                    //following workaround necessary so that view is reset to 'detail' ("wechseln")
                    var test1 = _this.webot.query('*').text('Dokumentansicht').exists();
                    var test2 = _this.webot.query('*').text('Konsenskisten-Titel').exists();
                    var test3 = _this.webot.query('p').contains('consetetur sadipscing elitr').exists();
                    var test4 = _this.webot.query('*').text('Detailansicht').exists(false);
                    _this.webot.queryContains('a', 'wechseln').click();
                    test.assert(function () { return test1; });
                    test.assert(function () { return test2; });
                    test.assert(function () { return test3; });
                    test.assert(function () { return test4; });
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('*').text('Detailansicht').exists(); });
                    test.assert(function () { return _this.webot.query('*').text('Dokumentansicht').exists(false); });
                    r();
                }
            ], function (err) { r(err); });
        };
        Tests.prototype.testKokiContent = function (async, r) {
            var _this = this;
            async();
            test.assert(function () { return _this.webot.query('h1').text('Konsenskisten-Titel').exists(); });
            test.assert(function () { return _this.webot.query('*').text('Lorem ipsum dolor sit amet').exists(); });
            r();
        };
        Tests.prototype.testKokiContext = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('Klärtext aufklappen').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () { return _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists(); });
                    _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () { return _this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists(false); });
                    r();
                }
            ], r);
        };
        Tests.prototype.testKaContext = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('Klärtext aufklappen').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () { return _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists(); });
                    _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').click();
                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () { return _this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists(false); });
                    r();
                }
            ], r);
        };
        Tests.prototype.testKaContent = function (async, r) {
            var _this = this;
            async();
            test.assert(function () { return _this.webot.query('h1').text('Kernaussagen-Titel').exists(); });
            test.assert(function () { return _this.webot.query('*').text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.').exists(); });
            r();
        };
        Tests.prototype.testCommunicator = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    var controller = reloader.controller();
                    var oldKoki = new KonsenskisteModel.Model;
                    oldKoki.id(15);
                    controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(oldKoki));
                    var newKoki = new KonsenskisteModel.Model;
                    newKoki.id(15);
                    newKoki.general().title('New Title');
                    newKoki.general().text('New Text');
                    var com = reloader.communicator();
                    com.konsenskiste.received.raise({ id: 15, konsenskiste: newKoki });
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('h1').text('New Title').exists(); });
                    test.assert(function () { return _this.webot.query('*').text('New Text').exists(); });
                    test.assert(function () { return _this.webot.query('*').text('Klärtext aufklappen').exists(false); });
                    r();
                }
            ], r);
        };
        Tests.prototype.konsenskisteComments = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    var model = reloader.model();
                    var communicator = reloader.communicator();
                    var serverModel = new KonsenskisteModel.Model();
                    serverModel.id(1);
                    var comment = new Comment.Model();
                    comment.content().text('Comment');
                    serverModel.discussion().comments.set([comment]);
                    communicator.konsenskiste.setTestKoki(serverModel);
                    setTimeout(r, 0);
                },
                function (r) {
                    _this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r, 300);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('.cmt').child('*').text('Comment').exists(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.kernaussageComments = function (async, r) {
            var _this = this;
            async();
            var serverKa = new KernaussageModel.Model();
            common.Callbacks.batch([
                function (r) {
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
                    test.assert(function () { return _this.webot.query('.cmt').child('*').text('Comment').exists(); });
                    var comment2 = new Comment.Model();
                    comment2.content().text('Comment2');
                    serverKa.discussion().comments.push(comment2);
                    _this.webot.query('.ka>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r, 100);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('.cmt').child('*').text('Comment2').exists(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.commentsLoading = function (async, r) {
            var _this = this;
            async();
            var controller = reloader.controller();
            var koki = new KonsenskisteModel.Model();
            koki.id(1);
            common.Callbacks.batch([
                function (r) {
                    controller.commandProcessor.processCommand(new KokiLogic.SetKokiCommand(koki));
                    _this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r);
                },
                function (r) {
                    koki.discussion().commentsLoading(true);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query(':contains("Diskussion")').child('*').text('Laden...').exists(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.rating = function (async, r) {
            var _this = this;
            async();
            var ratingButtons = this.webot.query('.kk>.controls .rating input[type="radio"]');
            var ratingLabels = this.webot.query('.kk>.controls .rating input[type="radio"] ~ label');
            common.Callbacks.batch([
                function (r) {
                    test.assert(function () { return ratingLabels.contains('?').exists(); });
                    var stronglikeLabel = ratingLabels.contains('++');
                    test.assert(function () { return stronglikeLabel.exists(); });
                    stronglikeLabel.click();
                    setTimeout(r, 100);
                },
                function (r) {
                    var stronglikeButton = ratingButtons.contains('++');
                    test.assert(function () { return _this.webot.query('.kk>.controls .rating input[type="radio"]:checked ~ label').contains('++').exists(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.newKaButtonExists = function (async, r) {
            async();
            var newKaButton = this.helper.getNewKaButton();
            test.assert(function () { return newKaButton.exists(); });
            r();
        };
        Tests.prototype.newKa = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.helper.getNewKaButton().click();
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.helper.isNewKaFormVisible(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.doubleClickNewKa = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.helper.getNewKaButton().click();
                    _this.helper.getNewKaButton().click();
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return !_this.helper.isNewKaFormVisible(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.submitNewKa = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.helper.getNewKaButton().click();
                    setTimeout(r);
                },
                function (r) {
                    _this.helper.submitNewKa();
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.helper.isNewKaSubmitted(); });
                    _this.helper.openDiscussionOfNewKa();
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.helper.isNewKaDiscussionVisible(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.history = function (async, r) {
            var _this = this;
            async();
            var communicator = reloader.communicator().konsenskiste;
            var viewModel = reloader.viewModel();
            var koki1 = new KonsenskisteModel.Model();
            koki1.id(123);
            koki1.general().text('This is Post #123');
            communicator.setTestKoki(koki1);
            var koki2 = new KonsenskisteModel.Model();
            koki2.id(246);
            koki2.general().text('This is Post #246');
            communicator.setTestKoki(koki2);
            common.Callbacks.batch([
                function (r) {
                    viewModel.center.win().setState({ kokiId: 123 });
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('*').text('This is Post #123').exists(); });
                    viewModel.center.win().setState({ kokiId: 246 });
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('*').text('This is Post #246').exists(); });
                    _this.webot.query('.win').contains('This is Post #246').child('h1').contains('Konsenskiste').child('*').text('<<').click();
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('*').text('This is Post #123').exists(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.permaLink = function (async, r) {
            async();
            var hash = JSON.parse(location.hash.slice(1));
            test.assert(function () { return hash.kokiId == 1; });
            r();
        };
        Tests.prototype.changePermaLink = function (async, r) {
            var _this = this;
            async();
            var com = reloader.communicator();
            var testKoki = new KonsenskisteModel.Model();
            testKoki.id(111);
            testKoki.general().title('KoKi #111');
            com.konsenskiste.setTestKoki(testKoki);
            common.Callbacks.batch([
                function (r) {
                    location.hash = '{ "kokiId": 111 }';
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('*').text('KoKi #111').exists(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.initialRatings = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    var serverKa = new KernaussageModel.Model();
                    serverKa.rating().personalRating('dislike');
                    var serverKoki = new KonsenskisteModel.Model();
                    serverKoki.id(592);
                    serverKoki.rating().personalRating('strongdislike');
                    serverKoki.childKas.push(serverKa);
                    var com = reloader.communicator();
                    com.konsenskiste.setTestKoki(serverKoki);
                    var koki = new KonsenskisteModel.Model();
                    koki.id(592);
                    reloader.controller().commandProcessor.processCommand(new KokiLogic.SetKokiCommand(koki));
                    com.konsenskiste.query(592);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('.kk>.controls .rating input[type="radio"]:checked ~ label').text('--').exists(); });
                    test.assert(function () { return _this.webot.query('.ka>.controls .rating input[type="radio"]:checked ~ label').text('-').exists(); });
                    r();
                }
            ], r);
        };
        Tests.prototype.appendComment = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
                    setTimeout(r);
                },
                function (r) {
                    _this.webot.query('.win').child('form').contains('Beitrag abschicken').child('textarea').$().val('This is a comment').change();
                    _this.webot.query('.win').child('form').child('button').contains('Beitrag abschicken').click();
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () { return _this.webot.query('.win').child('.cmt:not(:contains("Beitrag abschicken"))').child('*').text('This is a comment').exists(); });
                    r();
                }
            ], r);
        };
        return Tests;
    })();
    exports.Tests = Tests;
    var Helper = (function () {
        function Helper(webot) {
            this.webot = webot;
        }
        Helper.prototype.getNewKaButton = function () {
            return this.webot.query('.kk *').text('+Kernaussage');
        };
        Helper.prototype.isNewKaFormVisible = function () {
            return this.webot.query('.kk').child('.ka').contains('Anfügen').exists();
        };
        Helper.prototype.submitNewKa = function () {
            var form = this.webot.query('.kk').child('.ka').contains('Anfügen');
            form.child('.title input[type=text]').$().val('Title').change();
            form.child('.text textarea').$().val('Text').change();
            form.child('.context textarea').$().val('Klärtext').change();
            form.child('button').text('Anfügen').click();
        };
        Helper.prototype.isNewKaSubmitted = function () {
            var ka = this.webot.query('.kk').child('.ka').contains('Diskussion');
            var form = this.webot.query('.kk').child('.ka').contains('Anfügen');
            return ka.contains('Title').contains('Text').contains('Klärtext aufklappen').exists() && form.exists(false);
        };
        Helper.prototype.openDiscussionOfNewKa = function () {
            var ka = this.webot.query('.kk').child('.ka').contains('Diskussion').contains('Title').contains('Text');
            ka.child('*').text('Diskussion').click();
        };
        Helper.prototype.isNewKaDiscussionVisible = function () {
            var discussion = this.webot.query('.win').child('h1:contains("Diskussion") ~ *');
            return discussion.contains('Text').exists() && discussion.contains('Title').exists()
                && !discussion.contains('Fehler').exists();
        };
        return Helper;
    })();
});
