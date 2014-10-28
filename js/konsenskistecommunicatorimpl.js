define(["require", "exports", 'event', 'discocontext', 'contentcommunicatorimpl', 'kernaussagecommunicatorimpl', 'discussioncommunicator', 'ratingcommunicator', 'konsenskistemodel', 'kernaussagemodel', 'contentmodel'], function(require, exports, Events, discoContext, ContentCommunicator, KernaussageCommunicator, DiscussionCommunicator, RatingCommunicator, KonsenskisteModel, KernaussageModel, ContentModel) {
    var KonsenskisteCommunicator = (function () {
        function KonsenskisteCommunicator() {
            this.received = new Events.EventImpl();
            this.receiptError = new Events.EventImpl();
            this.kernaussageAppended = new Events.EventImpl();
            this.kernaussageAppendingError = new Events.EventImpl();
            this.content = new ContentCommunicator;
            this.discussion = new DiscussionCommunicator.Main();
            this.kernaussage = new KernaussageCommunicator({ content: this.content });
            this.rating = new RatingCommunicator.Main();
        }
        KonsenskisteCommunicator.prototype.createAndAppendKa = function (kokiId, ka) {
            throw new Error('not implemented');
        };

        KonsenskisteCommunicator.prototype.queryKoki = function (id) {
            var _this = this;
            var out = new KonsenskisteModel.Model();
            out.loading(true);
            out.id(id);

            this.queryRaw(id).then(function (rawKokis) {
                if (rawKokis.length != 1) {
                    out.error('koki id[' + id + '] could not be found');
                    out.loading(false);
                    _this.receiptError.raise({ id: id, message: "a single koki could not be found for this id[" + id + "].", konsenskiste: out });
                    return out;
                }
                out.error(null);
                out.loading(false);
                var parsedKoki = _this.parse(rawKokis[0], out);
                _this.received.raise({ id: id, konsenskiste: parsedKoki });
            });

            return out;
        };

        KonsenskisteCommunicator.prototype.queryRaw = function (id) {
            return discoContext.Posts.filter(function (it) {
                return it.Id == this.Id;
            }, { Id: id }).include("ReferredFrom.Referrer.Content").include("ReferredFrom.Referrer.Ratings").include("ReferredFrom.Referrer.Ratings.ModifiedBy.Author").include("ReferredFrom.Referrer.ReferredFrom").include("ReferredFrom.Referrer.ReferredFrom.ReferenceType.Description").include("ReferredFrom.Referrer.RefersTo.Referree.Content").include("ReferredFrom.Referrer.RefersTo.ReferenceType.Description").include("ReferredFrom.ReferenceType.Description").include("RefersTo.Referree").include("RefersTo.Referree.Ratings").include("RefersTo.Referree.Ratings.ModifiedBy.Author").include("RefersTo.Referree.Content").include("RefersTo.ReferenceType").include("RefersTo.ReferenceType.Description").include("Content").include("Ratings").include("Ratings.ModifiedBy.Author").toArray();
        };

        KonsenskisteCommunicator.prototype.parse = function (rawKoki, out) {
            var _this = this;
            out = out || new KonsenskisteModel.Model();
            out.id(parseInt(rawKoki.Id));
            this.parseGeneralContent(rawKoki, out.general());
            this.parseContext(rawKoki, out.context());

            rawKoki.ReferredFrom.forEach(function (reference) {
                if (reference.ReferenceType.Description.Name == 'Part') {
                    var ka = _this.parseKa(reference.Referrer);
                    out.childKas.push(ka);
                }
            });

            return out;
        };

        KonsenskisteCommunicator.prototype.parseKa = function (rawKa) {
            var ka = new KernaussageModel.Model;
            ka.id(parseInt(rawKa.Id));
            this.parseGeneralContent(rawKa, ka.general());
            this.parseContext(rawKa, ka.context());
            return ka;
        };

        KonsenskisteCommunicator.prototype.parseGeneralContent = function (rawPost, out) {
            out = out || new ContentModel.General;
            out.title(rawPost.Content.Title);
            out.text(rawPost.Content.Text);
            return out;
        };

        KonsenskisteCommunicator.prototype.parseContext = function (rawPost, out) {
            var rawContext = this.extractRawContext(rawPost);
            if (rawContext) {
                out = out || new ContentModel.Context;
                out.text(rawContext.Content.Text);
                return out;
            }
        };

        KonsenskisteCommunicator.prototype.extractRawContext = function (rawPost) {
            var ret;
            rawPost.RefersTo.forEach(function (reference) {
                if (reference.ReferenceType.Description.Name == 'Context') {
                    ret = reference.Referree;
                }
            });
            return ret;
        };
        return KonsenskisteCommunicator;
    })();

    
    return KonsenskisteCommunicator;
});
