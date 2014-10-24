define(["require", "exports", 'event', 'discocontext', 'contentcommunicatorimpl', 'kernaussagecommunicatorimpl', 'discussioncommunicator', 'ratingcommunicator', 'konsenskistemodel', 'kernaussagemodel', 'contentmodel'], function(require, exports, Events, discoContext, ContentCommunicator, KernaussageCommunicator, DiscussionCommunicator, RatingCommunicator, KonsenskisteModel, KernaussageModel, ContentModel) {
    var KonsenskisteCommunicator = (function () {
        function KonsenskisteCommunicator() {
            this.received = new Events.EventImpl();
            this.kernaussageAppended = new Events.EventImpl();
            this.content = new ContentCommunicator;
            this.discussion = new DiscussionCommunicator.Main();
            this.kernaussage = new KernaussageCommunicator({ content: this.content });
            this.rating = new RatingCommunicator.Main();
        }
        KonsenskisteCommunicator.prototype.createAndAppendKa = function (kokiId, ka) {
            throw new Error('not implemented');
        };

        KonsenskisteCommunicator.prototype.queryKoki = function (id, err) {
            var _this = this;
            this.queryRaw(id).then(function (rawKokis) {
                if (rawKokis.length != 1) {
                    var error = new Error('KonsenskisteCommunicatorImpl.query: a single koki could not be found for this id.');
                    err && err(error);
                    throw error;
                }
                var parsedKoki = _this.parse(rawKokis[0]);
                _this.received.raise({ id: id, konsenskiste: parsedKoki });
            });
        };

        KonsenskisteCommunicator.prototype.queryRaw = function (id) {
            return discoContext.Posts.filter(function (it) {
                return it.Id == this.Id;
            }, { Id: id }).include("ReferredFrom.Referrer.Content").include("ReferredFrom.Referrer.Ratings").include("ReferredFrom.Referrer.Ratings.ModifiedBy.Author").include("ReferredFrom.Referrer.ReferredFrom").include("ReferredFrom.Referrer.ReferredFrom.ReferenceType.Description").include("ReferredFrom.Referrer.RefersTo.Referree.Content").include("ReferredFrom.Referrer.RefersTo.ReferenceType.Description").include("ReferredFrom.ReferenceType.Description").include("RefersTo.Referree").include("RefersTo.Referree.Ratings").include("RefersTo.Referree.Ratings.ModifiedBy.Author").include("RefersTo.Referree.Content").include("RefersTo.ReferenceType").include("RefersTo.ReferenceType.Description").include("Content").include("Ratings").include("Ratings.ModifiedBy.Author").toArray();
        };

        KonsenskisteCommunicator.prototype.parse = function (rawKoki) {
            var _this = this;
            var koki = new KonsenskisteModel.Model;
            koki.id(parseInt(rawKoki.Id));
            this.parseGeneralContent(rawKoki, koki.general());
            this.parseContext(rawKoki, koki.context());

            rawKoki.ReferredFrom.forEach(function (reference) {
                if (reference.ReferenceType.Description.Name == 'Part') {
                    var ka = _this.parseKa(reference.Referrer);
                    koki.childKas.push(ka);
                }
            });

            return koki;
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
