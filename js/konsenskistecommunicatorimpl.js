define(["require", "exports", 'event', 'common', 'discocontext', 'contentcommunicatorimpl', 'kernaussagecommunicatorimpl', 'discussioncommunicatorimpl', 'ratingcommunicatorimpl', 'konsenskistemodel', 'kernaussagemodel', 'contentmodel'], function(require, exports, Events, Common, discoContext, ContentCommunicator, KernaussageCommunicator, DiscussionCommunicatorImpl, RatingCommunicatorImpl, KonsenskisteModel, KernaussageModel, ContentModel) {
    var Main = (function () {
        function Main() {
            this.received = new Events.EventImpl();
            this.receiptError = new Events.EventImpl();
            this.kernaussageAppended = new Events.EventImpl();
            this.kernaussageAppendingError = new Events.EventImpl();
            this.parser = new Parser();
            this.content = new ContentCommunicator;
            this.discussion = new DiscussionCommunicatorImpl.Main();
            this.discussion.content = this.content;
            this.kernaussage = new KernaussageCommunicator.Main({ content: this.content });
            this.rating = new RatingCommunicatorImpl.Main();
        }
        Main.prototype.createAndAppendKa = function (kokiId, ka) {
            var _this = this;
            var onError = function (message) {
                _this.kernaussageAppendingError.raise({ konsenskisteId: kokiId, message: message.toString() });
            };

            var content;
            var post;
            var reference = new Disco.Ontology.PostReference();
            var cxtContent = new Disco.Ontology.Content();
            var cxtPost = new Disco.Ontology.Post();
            var cxtReference = new Disco.Ontology.PostReference();
            Common.Callbacks.batch([
                function (r) {
                    content = _this.createContent(ka.general(), function () {
                        return r();
                    }, function (err) {
                        return onError(err);
                    });
                },
                function (r) {
                    post = _this.createPost({ typeId: '6', contentId: content.Id }, function () {
                        return r();
                    }, function (err) {
                        return onError(err);
                    });
                },
                function (r) {
                    reference = _this.createPostReference({ typeId: '11', referrerId: post.Id, referreeId: kokiId.toString() }, function () {
                        return r();
                    }, function (err) {
                        return onError(err);
                    });
                },
                function (r) {
                    cxtContent.Text = ka.context().text();
                    cxtContent.CultureId = '2';
                    discoContext.Content.add(cxtContent);
                    discoContext.saveChanges().then(function () {
                        return r();
                    }).fail(function (error) {
                        return onError(error);
                    });
                },
                function (r) {
                    cxtPost.PostTypeId = '2';
                    cxtPost.ContentId = cxtContent.Id;
                    discoContext.Posts.add(cxtPost);
                    discoContext.saveChanges().then(function () {
                        return r();
                    }).fail(function (error) {
                        return onError(error);
                    });
                },
                function (r) {
                    cxtReference.ReferrerId = post.Id;
                    cxtReference.ReferreeId = cxtPost.Id;
                    cxtReference.ReferenceTypeId = '10';
                    discoContext.PostReferences.add(cxtReference);
                    discoContext.saveChanges().then(function () {
                        return r();
                    }).fail(function (error) {
                        return onError(error);
                    });
                }
            ], function (err) {
                if (err)
                    onError(err);
                else {
                    ka.id(parseInt(post.Id));
                    _this.kernaussageAppended.raise({ konsenskisteId: kokiId, kernaussage: ka });
                }
            });
        };

        Main.prototype.query = function (id) {
            var _this = this;
            var onError = function (message) {
                out.queryState().error(message);
                out.queryState().loading(false);
                _this.receiptError.raise({ id: id, message: message, konsenskiste: out });
            };
            var out = new KonsenskisteModel.Model();
            out.queryState().loading(true);
            out.id(id);

            this.queryRaw(id).then(function (rawKokis) {
                if (rawKokis.length != 1) {
                    onError('koki id[' + id + '] could not be found');
                    return;
                }
                out.queryState().error(null);
                out.queryState().loading(false);
                var parsedKoki = _this.parser.parse(rawKokis[0], out);
                _this.received.raise({ id: id, konsenskiste: parsedKoki });
            }).fail(function (error) {
                return onError("JayData request failed");
            });

            return out;
        };

        Main.prototype.create = function (koki, parentTopicId, then) {
            var _this = this;
            var content;
            var post;
            var topicReference;
            Common.Callbacks.batch([
                function (r) {
                    content = _this.createContent(koki.general(), function () {
                        return r();
                    }, function (err) {
                        throw err;
                    });
                },
                function (r) {
                    post = _this.createPost({ typeId: '2', contentId: content.Id }, function () {
                        return r();
                    }, function (err) {
                        throw err;
                    });
                },
                function (r) {
                    if (parentTopicId) {
                        topicReference = _this.createPostReference({ typeId: '2', referrerId: post.Id, referreeId: parentTopicId.toString() }, function () {
                            return r();
                        }, function (err) {
                            throw err;
                        });
                    } else
                        r();
                }
            ], function (err) {
                if (err)
                    throw err;
                else
                    then(parseInt(post.Id));
            });
        };

        Main.prototype.queryRaw = function (id) {
            return discoContext.Posts.filter(function (it) {
                return it.Id == this.Id;
            }, { Id: id }).include("ReferredFrom.Referrer.Content").include("ReferredFrom.Referrer.Ratings").include("ReferredFrom.Referrer.Ratings.ModifiedBy.Author").include("ReferredFrom.Referrer.ReferredFrom").include("ReferredFrom.Referrer.ReferredFrom.ReferenceType.Description").include("ReferredFrom.Referrer.RefersTo.Referree.Content").include("ReferredFrom.Referrer.RefersTo.ReferenceType.Description").include("ReferredFrom.ReferenceType.Description").include("RefersTo.Referree").include("RefersTo.Referree.Ratings").include("RefersTo.Referree.Ratings.ModifiedBy.Author").include("RefersTo.Referree.Content").include("RefersTo.ReferenceType").include("RefersTo.ReferenceType.Description").include("Content").include("Ratings").include("Ratings.ModifiedBy.Author").toArray();
        };

        Main.prototype.createContent = function (content, then, fail) {
            var discoContent = new Disco.Ontology.Content();
            discoContent.Title = content.title();
            discoContent.Text = content.text();
            discoContent.CultureId = '2';

            discoContext.Content.add(discoContent);
            discoContext.saveChanges().then(function () {
                return then(parseInt(discoContent.Id));
            }).fail(function (error) {
                return fail(error);
            });

            return discoContent;
        };

        Main.prototype.createPost = function (props, then, fail) {
            var discoPost = new Disco.Ontology.Post();
            discoPost.PostTypeId = props.typeId;
            discoPost.ContentId = props.contentId;

            discoContext.Posts.add(discoPost);
            discoContext.saveChanges().then(function () {
                return then();
            }).fail(function (error) {
                return fail(error);
            });

            return discoPost;
        };

        Main.prototype.createPostReference = function (props, then, fail) {
            var discoReference = new Disco.Ontology.PostReference();
            discoReference.ReferrerId = props.referrerId;
            discoReference.ReferreeId = props.referreeId;
            discoReference.ReferenceTypeId = props.typeId;

            discoContext.PostReferences.add(discoReference);
            discoContext.saveChanges().then(function () {
                return then();
            }).fail(function (error) {
                return fail(error);
            });

            return discoReference;
        };
        return Main;
    })();
    exports.Main = Main;

    var Parser = (function () {
        function Parser() {
            this.ratingParser = new RatingCommunicatorImpl.Parser();
        }
        Parser.prototype.parse = function (rawKoki, out) {
            var _this = this;
            out = out || new KonsenskisteModel.Model();
            out.id(parseInt(rawKoki.Id));
            this.parseGeneralContent(rawKoki, out.general());
            this.parseContext(rawKoki, out.context());
            if (rawKoki.Ratings)
                this.ratingParser.parse(rawKoki.Ratings, out.rating());

            if (rawKoki.ReferredFrom) {
                out.childKas.set([]);
                rawKoki.ReferredFrom.forEach(function (reference) {
                    if (reference.ReferenceType.Description.Name == 'Part') {
                        var ka = _this.parseKa(reference.Referrer);
                        out.childKas.push(ka);
                    }
                });
            }

            return out;
        };

        Parser.prototype.parseKa = function (rawKa) {
            var ka = new KernaussageModel.Model;
            ka.id(parseInt(rawKa.Id));
            this.parseGeneralContent(rawKa, ka.general());
            this.parseContext(rawKa, ka.context());
            this.ratingParser.parse(rawKa.Ratings, ka.rating());
            return ka;
        };

        Parser.prototype.parseGeneralContent = function (rawPost, out) {
            out = out || new ContentModel.General;
            out.postId = parseInt(rawPost.Id);
            out.title(rawPost.Content.Title);
            out.text(rawPost.Content.Text);
            return out;
        };

        Parser.prototype.parseContext = function (rawPost, out) {
            var rawContext = this.extractRawContext(rawPost);
            if (rawContext) {
                out = out || new ContentModel.Context;
                out.postId = parseInt(rawPost.Id);
                out.text(rawContext.Content.Text);
                return out;
            }
        };

        Parser.prototype.extractRawContext = function (rawPost) {
            if (!rawPost.RefersTo)
                return null;
            var ret;
            rawPost.RefersTo.forEach(function (reference) {
                if (reference.ReferenceType.Description.Name == 'Context') {
                    ret = reference.Referree;
                }
            });
            return ret;
        };
        return Parser;
    })();
    exports.Parser = Parser;
});
