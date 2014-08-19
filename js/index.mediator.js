///<reference path="../typings/disco.d.ts" />
define(["require", "exports", 'index.model', 'disco', 'common'], function(require, exports, model, jayDisco, common) {
    var Context = (function () {
        function Context() {
        }
        return Context;
    })();
    exports.Context = Context;

    var MediatorPromiseData = (function () {
        function MediatorPromiseData() {
            var _this = this;
            this.promise = new MediatorPromiseImpl(this);
            this.fireThen = function (x) {
                _this.thenArg = x;
                _this.update();
            };
            this.fireFail = function () {
                _this.failFired = true;
                _this.update();
            };
            this.thenArg = null;
            this.failFired = false;
            this.update = function () {
                if (_this.thenArg && _this.then) {
                    _this.then(_this.thenArg);
                    _this.thenArg = null;
                }
                if (_this.failFired && _this.fail) {
                    _this.failFired = false;
                    _this.fail();
                }
            };
        }
        return MediatorPromiseData;
    })();

    var MediatorPromiseImpl = (function () {
        function MediatorPromiseImpl(data) {
            this.data = data;
        }
        MediatorPromiseImpl.prototype.then = function (handler) {
            this.data.then = handler;
            this.data.update();
            return this;
        };
        MediatorPromiseImpl.prototype.fail = function (handler) {
            this.data.fail = handler;
            this.data.update();
            return this;
        };
        return MediatorPromiseImpl;
    })();

    var DiscoMediator = (function () {
        function DiscoMediator(discoUri, cxt) {
            this.cxt = cxt;
            this.discoContext = new jayDisco.Context(discoUri);
            this.connectEventMgr();
        }
        DiscoMediator.prototype.setAuthDataFunction = function (func) {
            jayDisco.AuthData = func;
        };

        DiscoMediator.prototype.getKonsenskiste = function (id, out) {
            var _this = this;
            var promiseData = new MediatorPromiseData();
            this.queryKonsenskiste(id).then(function (rsp) {
                var kk = out || new model.KonsenskisteImpl();
                _this.parseKonsenskiste(rsp[0], kk);
                promiseData.fireThen(kk);
            });
            return promiseData.promise;
        };

        DiscoMediator.prototype.getTopic = function (id, out) {
            var _this = this;
            var promiseData = new MediatorPromiseData();
            var tpc = out || new model.Topic();
            common.Callbacks.atOnce([
                function (ready) {
                    if (id) {
                        _this.queryTopic(id).then(function (rsp) {
                            _this.parseTopic(rsp[0], tpc);
                            promiseData.fireThen(tpc);
                            ready();
                        });
                    } else
                        ready();
                },
                function (ready) {
                    _this.queryTopicChildren(id).then(function (rsp) {
                        _this.parseTopicChildren(rsp, tpc);

                        //promiseData.fireThen(tpc);
                        ready();
                    });
                },
                function (ready) {
                    _this.queryTopicKks(id).then(function (rsp) {
                        _this.parseTopicKks(rsp, tpc);
                        ready();
                    });
                }
            ], function () {
            });
            return promiseData.promise;
        };

        DiscoMediator.prototype.getKommentar = function (id, parent, out) {
            var _this = this;
            var promiseData = new MediatorPromiseData();
            this.queryKommentar(id).then(function (rsp) {
                var cmt = out || new model.Kommentar();
                _this.parseKommentar(rsp[0], parent, cmt);
                promiseData.fireThen(cmt);
            });
            return promiseData.promise;
        };

        DiscoMediator.prototype.getKommentare = function (parent) {
            var _this = this;
            var promiseData = new MediatorPromiseData();
            parent.comments([]);

            /*this.queryParentKommentare(parent).then(rsp => {
            rsp.forEach(rawCmt => {
            var cmt = new model.Kommentar();
            this.parseKommentar(rawCmt, parent, cmt);
            parent.comments.push(cmt);
            });
            promiseData.fireThen(parent);
            });*/
            this.queryCommentable(parent.id).then(function (rsp) {
                _this.parseQkCommentableModule(rsp[0], parent);
                promiseData.fireThen(parent);
            });
            return promiseData.promise;
        };

        DiscoMediator.prototype.queryKonsenskiste = function (id) {
            return this.discoContext.Posts.filter(function (it) {
                return it.Id == this.Id;
            }, { Id: id }).include("ReferredFrom.Referrer.Content").include("ReferredFrom.Referrer.Ratings").include("ReferredFrom.Referrer.Ratings.ModifiedBy.Author").include("ReferredFrom.Referrer.ReferredFrom").include("ReferredFrom.Referrer.ReferredFrom.ReferenceType.Description").include("ReferredFrom.Referrer.RefersTo.Referree.Content").include("ReferredFrom.Referrer.RefersTo.ReferenceType.Description").include("ReferredFrom.ReferenceType.Description").include("RefersTo.Referree").include("RefersTo.Referree.Ratings").include("RefersTo.Referree.Ratings.ModifiedBy.Author").include("RefersTo.ReferenceType").include("RefersTo.ReferenceType.Description").include("Content").include("Ratings").include("Ratings.ModifiedBy.Author").toArray();
        };

        DiscoMediator.prototype.queryCommentable = function (id) {
            return this.discoContext.Posts.filter(function (it) {
                return it.Id == this.Id;
            }, { Id: id }).include("ReferredFrom.ReferenceType.Description").include("ReferredFrom.Referrer.Content").include("ReferredFrom.Referrer.Ratings").include("ReferredFrom.Referrer.Ratings.ModifiedBy.Author").toArray();
        };

        DiscoMediator.prototype.queryTopic = function (id) {
            return this.discoContext.Posts.filter(function (it) {
                return it.Id == this.Id;
            }, { Id: id }).include("Content").include("ReferredFrom.Referrer.Content").include("ReferredFrom.ReferenceType.Description").toArray();
        };

        DiscoMediator.prototype.queryTopicChildren = function (id) {
            var parentlessFilter = this.discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name != "Child";
            });
            var subFilter = this.discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name == "Child" && it.Referree.Id == this.id;
            }, { id: id });

            return id ? this.discoContext.Posts.filter(function (it) {
                return it.PostType.Description.Name == "Topic" && it.RefersTo.some(this.subFilter);
            }, { subFilter: subFilter }).include("Content").toArray() : this.discoContext.Posts.filter(function (it) {
                return it.PostType.Description.Name == "Topic" && it.RefersTo.every(this.parentlessFilter);
            }, { parentlessFilter: parentlessFilter }).include("Content").toArray();
        };

        DiscoMediator.prototype.queryTopicKks = function (id) {
            var dependenceFilter = this.discoContext.PostReferences.filter(function (it) {
                return it.Referree.Id == this.id;
            }, { id: id });
            var kaRefFilter = this.discoContext.PostReferences.filter(function (it) {
                return it.ReferenceType.Description.Name == 'Part';
            });

            return this.discoContext.Posts.filter(function (it) {
                return it.RefersTo.some(this.dependenceFilter) && it.ReferredFrom.some(this.kaRefFilter);
            }, { dependenceFilter: dependenceFilter, kaRefFilter: kaRefFilter }).include("Content").toArray();
        };

        DiscoMediator.prototype.queryKommentare = function (ids) {
            return this.discoContext.Posts.filter(ids.map(function (x) {
                return "it.Id == " + x;
            }).join('||')).include("Content").include("Ratings.ModifiedBy.Author").toArray();
        };

        DiscoMediator.prototype.queryParentKommentare = function (parent) {
            var filter = this.discoContext.PostReferences.filter("it.ReferreeId == this.Id", { Id: parent.id });
            return this.discoContext.Posts.filter("it.RefersTo.some(this.filter)", { filter: filter }).include("Content").include("Ratings.ModifiedBy.Author").toArray();
        };

        DiscoMediator.prototype.queryKommentar = function (id) {
            return this.queryKommentare([id]);
        };

        DiscoMediator.prototype.parseKonsenskiste = function (raw, out) {
            var _this = this;
            this.parseQkElement(raw, out);
            this.parseQkCommentableModule(raw, out);
            this.parseQkWithContextModule(raw, out);

            out.children([]);

            raw.ReferredFrom.forEach(function (reference) {
                if (reference.ReferenceType.Description.Name == 'Part') {
                    var rawKa = reference.Referrer;
                    var ka = new model.KernaussageImpl();

                    _this.parseKernaussage(rawKa, out, ka);
                    out.children.push(ka);
                }
            });
        };

        DiscoMediator.prototype.parseTopic = function (raw, out) {
            out.id = parseInt(raw.Id);
            out.title(raw.Content.Title);
            out.text(raw.Content.Text);
            /*var children = common.Coll.where(raw.ReferredFrom, ref => ref.ReferenceType.Description.Name == 'Child').map(r => r.Referrer);
            out.children(children.map(c => {
            var t = new model.Topic(c.Id);
            t.title(c.Content.Title);
            t.text(c.Content.Text);
            return t;
            }));*/
        };

        DiscoMediator.prototype.parseTopicChildren = function (raw, out) {
            var _this = this;
            out.children(raw.map(function (c) {
                var t = new model.Topic(parseInt(c.Id));
                _this.parseTopic(c, t);
                return t;
            }));
        };

        DiscoMediator.prototype.parseTopicKks = function (raw, out) {
            out.kks(raw.map(function (c) {
                var k = new model.KonsenskisteImpl(parseInt(c.Id));
                k.title(c.Content.Title);
                k.text(c.Content.Text);
                return k;
            }));
        };

        DiscoMediator.prototype.parseKernaussage = function (raw, parent, out) {
            this.parseQkElement(raw, out);
            this.parseQkChildModule(raw, parent, out);
            this.parseQkCommentableModule(raw, out);
            this.parseQkWithContextModule(raw, out);
        };

        DiscoMediator.prototype.parseKommentar = function (raw, parent, out) {
            this.parseQkElement(raw, out);
            out.parent(parent);
        };

        DiscoMediator.prototype.parseQkChildModule = function (raw, parent, out) {
            out.parent(parent);
        };

        DiscoMediator.prototype.parseQkCommentableKommentare = function (raw, parent, out) {
            var _this = this;
            out.comments().forEach(function (cmt) {
                var rawCmt = common.Coll.single(raw, function (c) {
                    return c.Id == cmt.id;
                });
                if (rawCmt)
                    _this.parseKommentar(rawCmt, parent, cmt);
            });
        };

        DiscoMediator.prototype.parseQkCommentableModule = function (raw, out) {
            var _this = this;
            raw.ReferredFrom.forEach(function (reference) {
                if (['Part', 'Child', 'Context'].indexOf(reference.ReferenceType.Description.Name) == -1) {
                    var cmt = new model.Kommentar();
                    cmt.id = parseInt(reference.ReferrerId);

                    if (reference.Referrer && reference.Referrer.Content && reference.Referrer.Ratings) {
                        //cmt.title(reference.Referrer.Content.Title);
                        //cmt.text(reference.Referrer.Content.Text);
                        _this.parseKommentar(reference.Referrer, out, cmt);
                    }

                    out.comments.push(cmt);
                }
            });
            out.comments.sort(function (a, b) {
                return a.id - b.id;
            });
        };

        DiscoMediator.prototype.selectContextReferences = function (refs) {
            return common.Coll.where(refs, function (ref) {
                return ref.ReferenceType.Description.Name == 'Context';
            });
        };

        DiscoMediator.prototype.selectContextReference = function (refs) {
            return refs[0];
        };

        DiscoMediator.prototype.parseQkWithContextModule = function (raw, out) {
            var cxts = this.selectContextReferences(raw.RefersTo);
            var cxt = this.selectContextReference(cxts);
            out.context(cxt && cxt.Referree.Content && cxt.Referree.Content.Text);
            if (cxts.length > 1)
                console.warn('There is more than a single context for post ' + raw.Id + '!');
        };

        DiscoMediator.prototype.parseQkElement = function (raw, out) {
            var _this = this;
            out.id = parseInt(raw.Id);
            out.title(raw.Content.Title);
            out.text(raw.Content.Text);

            if (raw.Ratings) {
                var myRatings = common.Coll.where(raw.Ratings, function (r) {
                    return r.ModifiedBy.Author.Alias == _this.cxt.mdl.user();
                });
                if (myRatings.length > 1)
                    console.warn("There's more than one Rating per Post and User!");
                out.rating(RatingMapper.fromDisco(myRatings[0]));

                out.stronglikeSum(common.Coll.where(raw.Ratings, function (r) {
                    return RatingMapper.fromDisco(r) == 'stronglike';
                }).length);
                out.likeSum(common.Coll.where(raw.Ratings, function (r) {
                    return RatingMapper.fromDisco(r) == 'like';
                }).length);
                out.neutralSum(common.Coll.where(raw.Ratings, function (r) {
                    return RatingMapper.fromDisco(r) == 'neutral';
                }).length);
                out.dislikeSum(common.Coll.where(raw.Ratings, function (r) {
                    return RatingMapper.fromDisco(r) == 'dislike';
                }).length);
                out.strongdislikeSum(common.Coll.where(raw.Ratings, function (r) {
                    return RatingMapper.fromDisco(r) == 'strongdislike';
                }).length);
            }
        };

        DiscoMediator.prototype.submitRating = function (postId, ratingVal) {
            var _this = this;
            var promiseData = new MediatorPromiseData();

            var discoRating = RatingMapper.toDisco(ratingVal);
            var user = 'anonymous';
            this.discoContext.Ratings.filter("it.ModifiedBy.Author.Alias == 'anonymous' && it.PostId == this.PostId", { PostId: postId }).toArray().then(function (rsp) {
                var rating;
                if (rsp.length > 0) {
                    rating = rsp[rsp.length - 1];
                } else {
                    rating = new Disco.Ontology.Rating();
                    _this.discoContext.Ratings.add(rating);
                }
                rating.Score = discoRating;
                rating.PostId = postId.toString();
                rating.UserId = '12';
                rating.save().then(function () {
                    return promiseData.fireThen(ratingVal);
                });
            });

            return promiseData.promise;
        };

        DiscoMediator.prototype.submitKk = function (title, text, parent, out) {
            var _this = this;
            var cnt;
            var post;
            var topicRef;
            common.Callbacks.batch([
                function (r) {
                    cnt = new Disco.Ontology.Content({ CultureId: '2', Title: title, Text: text });
                    _this.discoContext.Content.add(cnt);
                    _this.discoContext.saveChanges(r);
                },
                function (r) {
                    post = new Disco.Ontology.Post({ ContentId: cnt.Id.toString(), PostTypeId: '2' });
                    _this.discoContext.Posts.add(post);
                    _this.discoContext.saveChanges(r);
                },
                function (r) {
                    if (parent.id) {
                        topicRef = new Disco.Ontology.PostReference({ ReferenceTypeId: '2', ReferrerId: post.Id.toString(), ReferreeId: parent.id.toString() });
                        _this.discoContext.PostReferences.add(topicRef);
                        _this.discoContext.saveChanges(r);
                    } else
                        r();
                },
                function (r) {
                    out.id = parseInt(post.Id);
                    out.title(cnt.Title);
                    out.text(cnt.Text);
                }
            ]);
        };

        DiscoMediator.prototype.submitKa = function (title, text, context, parent, out) {
            var _this = this;
            if (!text || text == '') {
                alert('submitKa: Text fehlt!');
                return;
            }

            var content, cxtContent;
            var post, cxtPost;
            var reference, cxtReference;
            common.Callbacks.batch([
                function (r) {
                    content = new Disco.Ontology.Content({ Title: title, Text: text, CultureId: "2" });
                    _this.discoContext.Content.add(content);
                    _this.discoContext.saveChanges().then(r);
                },
                function (r) {
                    post = new Disco.Ontology.Post({ ContentId: content.Id.toString(), PostTypeId: "2" });
                    _this.discoContext.Posts.add(post);
                    _this.discoContext.saveChanges().then(r);
                },
                function (r) {
                    reference = new Disco.Ontology.PostReference({ ReferenceTypeId: "11" /* Child */ , ReferrerId: post.Id.toString(), ReferreeId: parent.id.toString() });
                    _this.discoContext.PostReferences.add(reference);
                    _this.discoContext.saveChanges().then(r);
                },
                function (r) {
                    if (context) {
                        cxtContent = new Disco.Ontology.Content({ Title: "(ein Klärtext)", Text: context, CultureId: "2" });
                        _this.discoContext.Content.add(cxtContent);
                        _this.discoContext.saveChanges().then(r);
                    } else
                        r();
                },
                function (r) {
                    if (context) {
                        cxtPost = new Disco.Ontology.Post({ ContentId: cxtContent.Id.toString(), PostTypeId: "2" });
                        _this.discoContext.Posts.add(cxtPost);
                        _this.discoContext.saveChanges().then(r);
                    } else
                        r();
                },
                function (r) {
                    if (context) {
                        cxtReference = new Disco.Ontology.PostReference({ ReferenceTypeId: "10" /* Context */ , ReferreeId: cxtPost.Id.toString(), ReferrerId: post.Id.toString() });
                        _this.discoContext.PostReferences.add(cxtReference);
                        _this.discoContext.saveChanges().then(r);
                    } else
                        r();
                },
                function (r) {
                    _this.cxt.emgr.kkNeeded({ id: parent.id, out: parent });
                }
            ]);
        };

        DiscoMediator.prototype.submitCmt = function (text, parent) {
            var _this = this;
            var cnt;
            var post;
            var ref;
            common.Callbacks.batch([
                function (r) {
                    cnt = new Disco.Ontology.Content({ CultureId: '2', Text: text });
                    _this.discoContext.Content.add(cnt);
                    _this.discoContext.saveChanges(r);
                },
                function (r) {
                    post = new Disco.Ontology.Post({ ContentId: cnt.Id.toString(), PostTypeId: '2' });
                    _this.discoContext.Posts.add(post);
                    _this.discoContext.saveChanges(r);
                },
                function (r) {
                    ref = new Disco.Ontology.PostReference({ ReferenceTypeId: '2', ReferrerId: post.Id.toString(), ReferreeId: parent.id.toString() });
                    _this.discoContext.PostReferences.add(ref);
                    _this.discoContext.saveChanges(r);
                },
                function (r) {
                    _this.cxt.emgr.commentsNeeded({ parent: parent });
                }
            ]);
        };

        DiscoMediator.prototype.removeKa = function (ka) {
            var _this = this;
            //TODO: Verknüpfung entfernen oder alles löschen?
            var refKaKk;
            common.Callbacks.batch([
                function (r) {
                    _this.discoContext.PostReferences.filter('it.ReferrerId == this.ReferrerId && this.ReferreeId == this.ReferreeId && it.ReferenceTypeId == 11', { ReferrerId: ka.id, ReferreeId: ka.parent().id }).toArray().then(function (rsp) {
                        refKaKk = rsp[0];
                        r();
                    });
                },
                function (r) {
                    if (refKaKk) {
                        refKaKk.remove();
                        _this.discoContext.saveChanges().then(r);
                    }
                },
                function (r) {
                    _this.cxt.emgr.kkNeeded({ id: ka.parent().id, out: ka.parent() });
                }
            ]);
        };

        DiscoMediator.prototype.removeCmt = function (cmt) {
            var _this = this;
            //TODO: Verknüpfung entfernen oder alles löschen?
            var refCmtKa;
            common.Callbacks.batch([
                function (r) {
                    _this.discoContext.PostReferences.filter('it.ReferrerId == this.ReferrerId && this.ReferreeId == this.ReferreeId', { ReferrerId: cmt.id, ReferreeId: cmt.parent().id }).toArray().then(function (rsp) {
                        refCmtKa = rsp[0];
                        r();
                    });
                },
                function (r) {
                    if (refCmtKa) {
                        refCmtKa.remove();
                        _this.discoContext.saveChanges().then(r);
                    }
                },
                function (r) {
                    cmt.parent().comments.remove(cmt);
                    //this.cxt.emgr.commentsNeeded({ parent: cmt.parent() });
                }
            ]);
        };

        DiscoMediator.prototype.updateMainElement = function (el, title, text) {
            var _this = this;
            this.discoContext.Posts.filter('it.Id == this.Id', { Id: el.id }).include('Content').toArray().then(function (rsp) {
                var post = rsp[0];
                if (post) {
                    _this.discoContext.Content.attach(post.Content);
                    post.Content.Title = title;
                    post.Content.Text = text;
                    _this.discoContext.saveChanges(function () {
                        el.title(title);
                        el.text(text);
                    });
                } else
                    alert('updateMainElement: Das zu ändernde Element existiert nicht (mehr)!');
            }).fail(function (err) {
                return alert('updateMainElement: JayData error: ' + err);
            });
        };

        DiscoMediator.prototype.updateContextOfElement = function (el, context) {
            var _this = this;
            var contextFilter = this.discoContext.PostReferences.filter('it.ReferenceType.Description.Name == "Context"' + '&& it.ReferrerId == this.ReferrerId', { ReferrerId: el.id });

            contextFilter.include('ReferenceType.Description').include('Referree.Content').toArray().then(function (refs) {
                var ref = _this.selectContextReference(refs);
                if (ref) {
                    _this.discoContext.Content.attach(ref.Referree.Content);
                    ref.Referree.Content.Text = context;
                    _this.discoContext.saveChanges(function () {
                        el.context(context);
                    });
                } else {
                    var content;
                    var post;
                    common.Callbacks.batch([
                        function (r) {
                            content = new Disco.Ontology.Content({ Title: '(ein Klärtext)', Text: context, CultureId: '2' });
                            _this.discoContext.Content.add(content);
                            _this.discoContext.saveChanges(r);
                        },
                        function (r) {
                            post = new Disco.Ontology.Post({ ContentId: content.Id, PostTypeId: '2' });
                            _this.discoContext.Posts.add(post);
                            _this.discoContext.saveChanges(r);
                        },
                        function (r) {
                            _this.discoContext.PostReferences.add(new Disco.Ontology.PostReference({ ReferreeId: post.Id, ReferrerId: el.id, ReferenceTypeId: '10' }));
                            _this.discoContext.saveChanges(r);
                        },
                        function (r) {
                            el.context(context);
                        }
                    ]);
                }
            }).fail(function (err) {
                return alert('updateMainElement: JayData error: ' + err);
            });
        };

        DiscoMediator.prototype.connectEventMgr = function () {
            var _this = this;
            this.cxt.emgr.registerKkNeeded(function (args) {
                _this.getKonsenskiste(args.id, args.out);
            });
            this.cxt.emgr.registerTopicNeeded(function (args) {
                _this.getTopic(args.id, args.out);
            });
            this.cxt.emgr.registerCommentsNeeded(function (args) {
                _this.getKommentare(args.parent);
            });
            this.cxt.emgr.registerRated(function (args) {
                _this.submitRating(args.postId, args.rating).then(args.then);
            });
            this.cxt.emgr.registerKkSubmitted(function (args) {
                _this.submitKk(args.title, args.text, args.parent, args.out);
            });
            this.cxt.emgr.registerKaSubmitted(function (args) {
                _this.submitKa(args.title, args.text, args.context, args.parent, args.out);
            });
            this.cxt.emgr.registerCmtSubmitted(function (args) {
                _this.submitCmt(args.text, args.parent);
            });
            this.cxt.emgr.registerRemoveKa(function (args) {
                _this.removeKa(args.ka);
            });
            this.cxt.emgr.registerRemoveCmt(function (args) {
                _this.removeCmt(args.cmt);
            });
            this.cxt.emgr.registerMainElementUpdate(function (args) {
                return _this.updateMainElement(args.element, args.newTitle, args.newText);
            });
            this.cxt.emgr.registerContextUpdate(function (args) {
                return _this.updateContextOfElement(args.element, args.newContext);
            });
        };

        DiscoMediator.prototype.disconnectEventMgr = function () {
            this.cxt.emgr.registerContextUpdate(null);
            this.cxt.emgr.registerMainElementUpdate(null);
            this.cxt.emgr.registerRemoveCmt(null);
            this.cxt.emgr.registerRemoveKa(null);
            this.cxt.emgr.registerCmtSubmitted(null);
            this.cxt.emgr.registerKaSubmitted(null);
            this.cxt.emgr.registerKkSubmitted(null);
            this.cxt.emgr.registerRated(null);
            this.cxt.emgr.registerCommentsNeeded(null);
            this.cxt.emgr.registerTopicNeeded(null);
            this.cxt.emgr.registerKkNeeded(null);
        };
        return DiscoMediator;
    })();
    exports.DiscoMediator = DiscoMediator;

    var RatingMapper = (function () {
        function RatingMapper() {
        }
        RatingMapper.fromDisco = function (rating) {
            if (rating) {
                return RatingMapper.strings[Math.round(rating.Score / 3) + 2];
            } else {
                return 'none';
            }
        };

        RatingMapper.toDisco = function (rating) {
            var index = RatingMapper.strings.indexOf(rating);
            if (index >= 0) {
                return (index - 2) * 3;
            }
            return null;
        };
        RatingMapper.strings = ['strongdislike', 'dislike', 'neutral', 'like', 'stronglike'];
        return RatingMapper;
    })();
});
