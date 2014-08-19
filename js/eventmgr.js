define(["require", "exports"], function(require, exports) {
    var EventMgr = (function () {
        function EventMgr() {
        }
        EventMgr.prototype.registerKkNeeded = function (handler) {
            if (this._kkNeeded)
                console.warn('The event KkNeeded was registered more than one time.');
            this._kkNeeded = handler;
        };

        EventMgr.prototype.registerTopicNeeded = function (handler) {
            if (this._topicNeeded)
                console.warn('The event TopicNeeded was registered more than one time.');
            this._topicNeeded = handler;
        };

        EventMgr.prototype.registerCommentsNeeded = function (handler) {
            if (this._commentsNeeded)
                console.warn('The event CommentsNeeded was registered more than one time.');
            this._commentsNeeded = handler;
        };

        EventMgr.prototype.registerRated = function (handler) {
            if (this._rated)
                console.warn('The event Rated was registered more than one time.');
            this._rated = handler;
        };

        EventMgr.prototype.registerTopicSelected = function (handler) {
            if (this._topicSelected)
                console.warn('The event TopicSelected was registered more than one time.');
            this._topicSelected = handler;
        };

        EventMgr.prototype.registerKkSubmitted = function (handler) {
            if (this._kkSubmitted)
                console.warn('The event KkSubmitted was registered more than one time.');
            this._kkSubmitted = handler;
        };

        EventMgr.prototype.registerKaSubmitted = function (handler) {
            if (this._kaSubmitted)
                console.warn('The event KaSubmitted was registered more than one time.');
            this._kaSubmitted = handler;
        };

        EventMgr.prototype.registerCmtSubmitted = function (handler) {
            if (this._cmtSubmitted)
                console.warn('The event CmtSubmitted was registered more than one time.');
            this._cmtSubmitted = handler;
        };

        EventMgr.prototype.registerRemoveKa = function (handler) {
            if (this._removeKa)
                console.warn('The event RemoveKa was registered more than one time.');
            this._removeKa = handler;
        };

        EventMgr.prototype.registerRemoveCmt = function (handler) {
            if (this._removeCmt)
                console.warn('The event RemoveCmt was registered more than one time.');
            this._removeCmt = handler;
        };

        EventMgr.prototype.registerMainElementUpdate = function (handler) {
            if (this._mainElementUpdate)
                console.warn('The event MainElementUpdate was registered more than one time.');
            this._mainElementUpdate = handler;
        };

        EventMgr.prototype.registerContextUpdate = function (handler) {
            if (this._contextUpdate)
                console.warn('The event ContextUpdate was registered more than one time.');
            this._contextUpdate = handler;
        };

        EventMgr.prototype.kkNeeded = function (args) {
            if (this._kkNeeded)
                this._kkNeeded(args);
            console.log('kkNeeded', args);
        };

        EventMgr.prototype.topicNeeded = function (args) {
            if (this._topicNeeded)
                this._topicNeeded(args);
            console.log('topicNeeded', args);
        };

        EventMgr.prototype.commentsNeeded = function (args) {
            if (this._commentsNeeded)
                this._commentsNeeded(args);
            console.log('commentsNeeded', args);
        };

        EventMgr.prototype.rated = function (args) {
            if (this._rated)
                this._rated(args);
            console.log('rated', args);
        };

        EventMgr.prototype.topicSelected = function (args) {
            if (this._topicSelected)
                this._topicSelected(args);
            console.log('topicSelected', args);
        };

        EventMgr.prototype.kkSubmitted = function (args) {
            if (this._kkSubmitted)
                this._kkSubmitted(args);
            console.log('kkSubmitted', args);
        };

        EventMgr.prototype.kaSubmitted = function (args) {
            if (this._kaSubmitted)
                this._kaSubmitted(args);
            console.log('kaSubmitted', args);
        };

        EventMgr.prototype.cmtSubmitted = function (args) {
            if (this._cmtSubmitted)
                this._cmtSubmitted(args);
            console.log('cmtSubmitted', args);
        };

        EventMgr.prototype.removeKa = function (args) {
            if (this._removeKa)
                this._removeKa(args);
            console.log('removeKa', args);
        };

        EventMgr.prototype.removeCmt = function (args) {
            if (this._removeCmt)
                this._removeCmt(args);
            console.log('removeCmt', args);
        };

        EventMgr.prototype.mainElementUpdate = function (args) {
            if (this._mainElementUpdate)
                this._mainElementUpdate(args);
            console.log('mainElementUpdate', args);
        };

        EventMgr.prototype.contextUpdate = function (args) {
            if (this._contextUpdate)
                this._contextUpdate(args);
            console.log('contextUpdate', args);
        };
        return EventMgr;
    })();
    exports.EventMgr = EventMgr;

    var KkNeededEventArgs = (function () {
        function KkNeededEventArgs() {
        }
        return KkNeededEventArgs;
    })();
    exports.KkNeededEventArgs = KkNeededEventArgs;

    var TopicNeededEventArgs = (function () {
        function TopicNeededEventArgs() {
        }
        return TopicNeededEventArgs;
    })();
    exports.TopicNeededEventArgs = TopicNeededEventArgs;

    var CommentsNeededEventArgs = (function () {
        function CommentsNeededEventArgs() {
        }
        return CommentsNeededEventArgs;
    })();
    exports.CommentsNeededEventArgs = CommentsNeededEventArgs;

    var RatedEventArgs = (function () {
        function RatedEventArgs() {
        }
        return RatedEventArgs;
    })();
    exports.RatedEventArgs = RatedEventArgs;

    var TopicSelectedEventArgs = (function () {
        function TopicSelectedEventArgs() {
        }
        return TopicSelectedEventArgs;
    })();
    exports.TopicSelectedEventArgs = TopicSelectedEventArgs;

    var KkSubmittedEventArgs = (function () {
        function KkSubmittedEventArgs() {
        }
        return KkSubmittedEventArgs;
    })();
    exports.KkSubmittedEventArgs = KkSubmittedEventArgs;

    var KaSubmittedEventArgs = (function () {
        function KaSubmittedEventArgs() {
        }
        return KaSubmittedEventArgs;
    })();
    exports.KaSubmittedEventArgs = KaSubmittedEventArgs;

    var CmtSubmittedEventArgs = (function () {
        function CmtSubmittedEventArgs() {
        }
        return CmtSubmittedEventArgs;
    })();
    exports.CmtSubmittedEventArgs = CmtSubmittedEventArgs;

    var RemoveKaEventArgs = (function () {
        function RemoveKaEventArgs() {
        }
        return RemoveKaEventArgs;
    })();
    exports.RemoveKaEventArgs = RemoveKaEventArgs;

    var RemoveCmtEventArgs = (function () {
        function RemoveCmtEventArgs() {
        }
        return RemoveCmtEventArgs;
    })();
    exports.RemoveCmtEventArgs = RemoveCmtEventArgs;

    var MainElementUpdateEventArgs = (function () {
        function MainElementUpdateEventArgs() {
        }
        return MainElementUpdateEventArgs;
    })();
    exports.MainElementUpdateEventArgs = MainElementUpdateEventArgs;

    var ContextUpdateEventArgs = (function () {
        function ContextUpdateEventArgs() {
        }
        return ContextUpdateEventArgs;
    })();
    exports.ContextUpdateEventArgs = ContextUpdateEventArgs;
});
