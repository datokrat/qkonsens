var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "index.model", "frame"], function(require, exports, model, frame) {
    var idCtr = 0;

    var Context = (function () {
        function Context() {
        }
        return Context;
    })();
    exports.Context = Context;

    var ViewModel = (function () {
        function ViewModel(mdl, emgr) {
            var _this = this;
            this.id = idCtr++;
            this.tabs = ko.observableArray();
            this.selectedTab = ko.observable();
            this.isBusy = ko.observable(false);
            this.isAdmin = ko.observable(true);
            this.cxt = { mdl: mdl, emgr: emgr, vm: this };

            this.userName = mdl.user;
            this.userName.subscribe(function () {
                return _this.onUserNameChanged();
            });

            this.helpTab = new HelpTab();
            this.startTab = new StartTab();
            this.kkTab = new KkTab(mdl.kk, this.cxt);
            this.browseTab = new BrowseTab(mdl.topic, this.cxt);
            this.newKkWin = new NewKkWin(mdl.topic, this.cxt);

            this.tabs([this.startTab, this.kkTab, this.browseTab, this.helpTab]);
            this.selectedTab(this.kkTab);

            this.center = new frame.WinContainer(this.kkTab);
            this.left = new frame.WinContainer(this.startTab);
            this.right = new frame.WinContainer(this.browseTab);
        }
        ViewModel.prototype.onUserNameChanged = function () {
            var oldKk = this.cxt.mdl.kk();
            var newKk = new model.KonsenskisteImpl();
            this.cxt.emgr.kkNeeded({ id: oldKk.id, out: newKk });
            this.cxt.mdl.kk(newKk);
        };
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;

    var StartTab = (function (_super) {
        __extends(StartTab, _super);
        function StartTab() {
            _super.call(this, 'start-win-template', null);
            this.state('ok');
        }
        return StartTab;
    })(frame.Win);
    exports.StartTab = StartTab;

    var HelpTab = (function (_super) {
        __extends(HelpTab, _super);
        function HelpTab() {
            _super.call(this, 'help-win-template', null);
        }
        return HelpTab;
    })(frame.Win);
    exports.HelpTab = HelpTab;

    var KkTab = (function (_super) {
        __extends(KkTab, _super);
        function KkTab(_kk, cxt) {
            var _this = this;
            _super.call(this, 'kk-win-template', null);
            this._kk = ko.observable();
            this.kk = ko.computed(function () {
                return _this._kk() ? _this._kk()() : null;
            });
            this.documentView = ko.observable(false);
            this.kkTitle = ko.computed(function () {
                return _this.kk() ? _this.kk().title() : null;
            });
            this.kkText = ko.computed(function () {
                return _this.kk() ? _this.kk().text() : null;
            });
            this.kkView = ko.computed(function () {
                return _this.kk() ? new KkView(_this.kk(), _this.cxt) : null;
            });
            this.cxt = cxt;
            this._kk(_kk);
        }
        return KkTab;
    })(frame.Win);
    exports.KkTab = KkTab;

    var BrowseTab = (function (_super) {
        __extends(BrowseTab, _super);
        function BrowseTab(_topic, cxt) {
            var _this = this;
            _super.call(this, 'browse-win-template', null);
            this._topic = ko.observable();
            this.topic = ko.computed(function () {
                return _this._topic() ? _this._topic()() : null;
            });
            this.parentTopicView = ko.computed(function () {
                return _this.topic() ? new ParentTopicView(_this.topic(), _this.cxt) : null;
            });
            this.cxt = cxt;
            this.state('ok');
            this._topic(_topic);
        }
        return BrowseTab;
    })(frame.Win);
    exports.BrowseTab = BrowseTab;

    var DiscussionWin = (function (_super) {
        __extends(DiscussionWin, _super);
        function DiscussionWin(parent, cxt) {
            var _this = this;
            _super.call(this, 'discussion-win-template', null);
            this.parent = ko.observable();
            this.cmtView = function (cmt) {
                return new CmtView(cmt, _this.cxt);
            };
            this.newCommentText = ko.observable();
            this.newCommentDisabled = ko.observable(false);
            this.submitComment_onClick = function () {
                console.log({ text: _this.newCommentText(), parent: _this.parent() });
                _this.cxt.emgr.cmtSubmitted({ text: _this.newCommentText(), parent: _this.parent() });
                _this.newCommentText('');
            };
            this.cxt = cxt;
            this.state('ok');
            this.parent(parent);
        }
        return DiscussionWin;
    })(frame.Win);
    exports.DiscussionWin = DiscussionWin;

    var NewKkWin = (function (_super) {
        __extends(NewKkWin, _super);
        function NewKkWin(parent, cxt) {
            var _this = this;
            _super.call(this, 'newkk-win-template', null);
            this.title = ko.observable();
            this.text = ko.observable();
            this.submit_onClick = function () {
                var kk = new model.KonsenskisteImpl();
                _this.cxt.emgr.kkSubmitted({ title: _this.title(), text: _this.text(), parent: _this.parent(), out: kk });
                _this.cxt.mdl.kk(kk);
                _this.cxt.vm.selectedTab(_this.cxt.vm.kkTab);
            };
            this.state('ok');

            this.parent = parent;
            this.parentDescription = ko.computed(function () {
                return _this.parent() ? (_this.parent().title() || _this.parent().text()) : 'null';
            });

            this.cxt = cxt;
        }
        return NewKkWin;
    })(frame.Win);
    exports.NewKkWin = NewKkWin;

    var EditorWin = (function (_super) {
        __extends(EditorWin, _super);
        function EditorWin(el, cxt) {
            var _this = this;
            _super.call(this, 'editor-win-template', null);
            this.save_onClick = function () {
                var inp = _this.input();
                _this.cxt.emgr.mainElementUpdate({ element: _this.element(), newText: inp.text(), newTitle: inp.title() });
            };
            this.saveContext_onClick = function () {
                var inp = _this.input();
                _this.cxt.emgr.contextUpdate({ element: _this.element(), newContext: inp.context() });
            };
            this.state('ok');
            this.cxt = cxt;

            this.element = el;
            this.input = ko.computed(function () {
                return {
                    text: ko.observable(_this.element().text()),
                    title: ko.observable(_this.element().title()),
                    context: ko.observable(_this.element().context())
                };
            });
        }
        return EditorWin;
    })(frame.Win);
    exports.EditorWin = EditorWin;

    var ParentTopicView = (function () {
        function ParentTopicView(topic, cxt) {
            var _this = this;
            this.childTopicView = function (tpc) {
                return new OverallTopicView(tpc, 1 /* Child */, _this.cxt);
            };
            this.breadcrumbTopicView = function (tpc) {
                return new OverallTopicView(tpc, 0 /* Breadcrumb */, _this.cxt);
            };
            this.kkView = function (kk) {
                return new TopicKkView(kk, _this.cxt);
            };
            this.newKk = {
                onClick: function () {
                    var vm = _this.cxt.vm;
                    vm.right.win(vm.newKkWin);
                }
            };
            this.cxt = cxt;
            this.topic = topic;
            this.title = ko.computed(function () {
                return _this.topic.id ? (_this.topic.title() ? _this.topic.title() : _this.topic.text()) : "[root]";
            });
            this.text = ko.computed(function () {
                return _this.topic.title() ? _this.topic.text() : null;
            });
            this.children = topic.children;
            this.breadcrumb = ko.computed(function () {
                return cxt.mdl.topicBreadcrumb().slice(0, -1);
            });
            this.kks = topic.kks;
        }
        return ParentTopicView;
    })();
    exports.ParentTopicView = ParentTopicView;

    var TopicKkView = (function () {
        function TopicKkView(kk, cxt) {
            var _this = this;
            this.click = function () {
                _this.cxt.mdl.kk(_this.kk);
                _this.cxt.emgr.kkNeeded({ id: _this.kk.id, out: _this.kk });
                _this.cxt.vm.selectedTab(_this.cxt.vm.kkTab);
            };
            this.cxt = cxt;
            this.kk = kk;
            this.caption = ko.computed(function () {
                return _this.kk.title() ? _this.kk.title() : _this.kk.text();
            });
        }
        return TopicKkView;
    })();
    exports.TopicKkView = TopicKkView;

    var OverallTopicView = (function () {
        function OverallTopicView(topic, role, cxt) {
            var _this = this;
            this.click = function () {
                _this.cxt.mdl.selectTopic(_this.topic, _this.role);
                _this.cxt.emgr.topicNeeded({ id: _this.topic.id, out: _this.topic });
            };
            this.cxt = cxt;
            this.topic = topic;
            this.role = role;
            this.title = topic.title;
            this.text = topic.text;
            this.caption = ko.computed(function () {
                if (_this.topic.id)
                    return _this.title() + ': ' + _this.text();
                else
                    return "[root]";
            });
        }
        return OverallTopicView;
    })();
    exports.OverallTopicView = OverallTopicView;

    var QkMainElementViewBase = (function () {
        function QkMainElementViewBase(qk, cxt) {
            var _this = this;
            this.id = idCtr++;
            this.type = 'qk-none';
            this.showAllComments = ko.observable(false);
            this.cmtView = function (cmt) {
                return new CmtView(cmt, _this._cxt);
            };
            this.disabled = ko.observable();
            this.newCommentText = ko.observable();
            this.clickRating = function (elem, rating) {
                return setTimeout.bind(null, function () {
                    _this._cxt.emgr.rated({ postId: _this.qk.id, rating: rating, then: function (rating) {
                            console.log(rating);
                            _this.qk.rating(rating);
                        } });
                }, 0);
            };
            this.submitComment_onClick = function () {
                console.log({ text: _this.newCommentText(), parent: _this.qk });
                _this._cxt.emgr.cmtSubmitted({ text: _this.newCommentText(), parent: _this.qk });
                _this.newCommentText('');
            };
            this.discussion_onClick = function () {
                var vm = _this._cxt.vm;
                vm.left.win(new DiscussionWin(_this.qk, _this._cxt));

                if (_this.comments().length && !_this.comments()[0].text())
                    _this._cxt.emgr.commentsNeeded({ parent: _this.qk });
            };
            this.edit_onClick = function () {
                var vm = _this._cxt.vm;
                vm.left.win(new EditorWin(ko.computed(function () {
                    return _this.qk;
                }), _this._cxt));
            };
            this.showContext = ko.observable(false);
            this.qk = qk;
            this._cxt = cxt;

            this.comments = qk.comments;
            this.context = qk.context;
            this.rating = qk.rating;
            this.likeRating = qk.likeRating;
            this.stronglikeSum = qk.stronglikeSum;
            this.likeSum = qk.likeSum;
            this.neutralSum = qk.neutralSum;
            this.dislikeSum = qk.dislikeSum;
            this.strongdislikeSum = qk.strongdislikeSum;

            this.showAllComments.subscribe(function (val) {
                if (val) {
                    if (_this.comments().length && !_this.comments()[0].text())
                        cxt.emgr.commentsNeeded({ parent: _this.qk });
                }
            });
        }
        return QkMainElementViewBase;
    })();
    exports.QkMainElementViewBase = QkMainElementViewBase;

    var KkView = (function (_super) {
        __extends(KkView, _super);
        function KkView(kk, cxt) {
            var _this = this;
            _super.call(this, kk, cxt);
            this.type = 'kk';
            this.kk = ko.observable();
            this.title = ko.computed(function () {
                return _this.kk() ? _this.kk().title() : null;
            });
            this.text = ko.computed(function () {
                return _this.kk() ? _this.kk().text() : null;
            });
            this.kaView = function (ka) {
                return new KaView(ka, _this.cxt);
            };
            this.kaForm = {
                isVisible: ko.observable(false),
                title: ko.observable(),
                text: ko.observable(),
                context: ko.observable(),
                onClick: function () {
                    _this.kaForm.isVisible(!_this.kaForm.isVisible());
                },
                onSubmit: function () {
                    var ka = new model.KernaussageImpl();
                    _this.cxt.emgr.kaSubmitted({ title: _this.kaForm.title(), text: _this.kaForm.text(), context: _this.kaForm.context(), parent: _this.kk(), out: ka });
                    _this.kk().children.push(ka);
                }
            };
            this.cxt = cxt;
            this.kk(kk);
            this.children = kk.children;
        }
        return KkView;
    })(QkMainElementViewBase);
    exports.KkView = KkView;

    var KaView = (function (_super) {
        __extends(KaView, _super);
        function KaView(ka, cxt) {
            var _this = this;
            _super.call(this, ka, cxt);
            this.type = 'ka';
            this.ka = ko.observable();
            this.title = ko.computed(function () {
                return _this.ka() ? _this.ka().title() : null;
            });
            this.text = ko.computed(function () {
                return _this.ka() ? _this.ka().text() : null;
            });
            this.remove_onClick = function () {
                if (confirm('Soll diese Kernaussage wirklich entfernt werden?')) {
                    _this.cxt.emgr.removeKa({ ka: _this.ka() });
                }
            };
            this.cxt = cxt;
            this.ka(ka);
        }
        return KaView;
    })(QkMainElementViewBase);
    exports.KaView = KaView;

    var CmtView = (function () {
        function CmtView(cmt, cxt) {
            var _this = this;
            this.id = idCtr++;
            this.type = 'cmt';
            this.cmt = ko.observable();
            this.title = ko.computed(function () {
                return _this.cmt() ? _this.cmt().title() : null;
            });
            this.text = ko.computed(function () {
                return _this.cmt() ? _this.cmt().text() : null;
            });
            this.remove_onClick = function () {
                if (confirm('Soll dieser Kommentar wirklich aus der Diskussion entfernt werden? (Er wird aber nicht gelöscht!)')) {
                    _this.cxt.emgr.removeCmt({ cmt: _this.cmt() });
                }
            };
            this.like_onClick = function (newRating) {
                return setTimeout.bind(null, function () {
                    _this.cxt.emgr.rated({ postId: _this.cmt().id, rating: newRating, then: function (rating) {
                            return _this.cmt().rating(rating);
                        } });
                }, 0);
            };
            this.cxt = cxt;
            this.cmt(cmt);
            this.rating = cmt.rating;
            this.likeRating = cmt.likeRating;
            this.stronglikeSum = cmt.stronglikeSum;
            this.likeSum = cmt.likeSum;
            this.neutralSum = cmt.neutralSum;
            this.dislikeSum = cmt.dislikeSum;
            this.strongdislikeSum = cmt.strongdislikeSum;
        }
        return CmtView;
    })();
    exports.CmtView = CmtView;
});
