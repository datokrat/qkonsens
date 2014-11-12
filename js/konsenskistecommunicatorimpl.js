define(["require", "exports", 'event', 'discocontext', 'contentcommunicatorimpl', 'kernaussagecommunicatorimpl', 'discussioncommunicator', 'ratingcommunicator', 'konsenskistemodel', 'kernaussagemodel', 'contentmodel'], function(require, exports, Events, discoContext, ContentCommunicator, KernaussageCommunicator, DiscussionCommunicator, RatingCommunicator, KonsenskisteModel, KernaussageModel, ContentModel) {
    var Main = (function () {
        function Main() {
            this.received = new Events.EventImpl();
            this.receiptError = new Events.EventImpl();
            this.kernaussageAppended = new Events.EventImpl();
            this.kernaussageAppendingError = new Events.EventImpl();
            this.parser = new Parser();
            this.content = new ContentCommunicator;
            this.discussion = new DiscussionCommunicator.Main();
            this.discussion.content = this.content;
            this.kernaussage = new KernaussageCommunicator.Main({ content: this.content });
            this.rating = new RatingCommunicator.Main();
        }
        Main.prototype.createAndAppendKa = function (kokiId, ka) {
            throw new Error('not implemented');
        };

        Main.prototype.query = function (id) {
            var _this = this;
            var onError = function (message) {
                out.error(message);
                out.loading(false);
                _this.receiptError.raise({ id: id, message: message, konsenskiste: out });
            };
            var out = new KonsenskisteModel.Model();
            out.loading(true);
            out.id(id);

            this.queryRaw(id).then(function (rawKokis) {
                if (rawKokis.length != 1) {
                    onError('koki id[' + id + '] could not be found');
                    return;
                }
                out.error(null);
                out.loading(false);
                var parsedKoki = _this.parser.parse(rawKokis[0], out);
                _this.received.raise({ id: id, konsenskiste: parsedKoki });
            }).fail(function (error) {
                return onError("JayData request failed");
            });

            return out;
        };

        Main.prototype.queryRaw = function (id) {
            return discoContext.Posts.filter(function (it) {
                return it.Id == this.Id;
            }, { Id: id }).include("ReferredFrom.Referrer.Content").include("ReferredFrom.Referrer.Ratings").include("ReferredFrom.Referrer.Ratings.ModifiedBy.Author").include("ReferredFrom.Referrer.ReferredFrom").include("ReferredFrom.Referrer.ReferredFrom.ReferenceType.Description").include("ReferredFrom.Referrer.RefersTo.Referree.Content").include("ReferredFrom.Referrer.RefersTo.ReferenceType.Description").include("ReferredFrom.ReferenceType.Description").include("RefersTo.Referree").include("RefersTo.Referree.Ratings").include("RefersTo.Referree.Ratings.ModifiedBy.Author").include("RefersTo.Referree.Content").include("RefersTo.ReferenceType").include("RefersTo.ReferenceType.Description").include("Content").include("Ratings").include("Ratings.ModifiedBy.Author").toArray();
        };
        return Main;
    })();
    exports.Main = Main;

    var Parser = (function () {
        function Parser() {
            this.ratingParser = new RatingCommunicator.Parser();
        }
        Parser.prototype.parse = function (rawKoki, out) {
            var _this = this;
            out = out || new KonsenskisteModel.Model();
            out.id(parseInt(rawKoki.Id));
            this.parseGeneralContent(rawKoki, out.general());
            this.parseContext(rawKoki, out.context());
            this.ratingParser.parse(rawKoki.Ratings, out.rating());

            rawKoki.ReferredFrom.forEach(function (reference) {
                if (reference.ReferenceType.Description.Name == 'Part') {
                    var ka = _this.parseKa(reference.Referrer);
                    out.childKas.push(ka);
                }
            });

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
            out.title(rawPost.Content.Title);
            out.text(rawPost.Content.Text);
            return out;
        };

        Parser.prototype.parseContext = function (rawPost, out) {
            var rawContext = this.extractRawContext(rawPost);
            if (rawContext) {
                out = out || new ContentModel.Context;
                out.text(rawContext.Content.Text);
                return out;
            }
        };

        Parser.prototype.extractRawContext = function (rawPost) {
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
