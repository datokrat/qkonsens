define(["require", "exports"], function(require, exports) {
    function initFrame() {
        var frame = top.frames[2];

        frame.$.fn.simulateClick = function () {
            return this.each(function () {
                if ('createEvent' in document) {
                    var doc = this.ownerDocument, evt = doc.createEvent('MouseEvents');
                    evt.initMouseEvent('click', true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                    this.dispatchEvent(evt);
                } else {
                    this.click(); // IE
                }
            });
        };

        frame.$.fn.simulateMouseEvent = function (eventName) {
            return this.each(function () {
                if ('createEvent' in document) {
                    var doc = this.ownerDocument, evt = doc.createEvent('MouseEvents');
                    evt.initMouseEvent(eventName, true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                    this.dispatchEvent(evt);
                } else {
                    this.click(); // IE
                }
            });
        };

        return frame;
    }

    var Webot = (function () {
        function Webot() {
            this.frame = initFrame();
        }
        Webot.prototype.query = function (q) {
            return new WebotElement(this.frame, q);
        };

        Webot.prototype.queryContains = function (q, text) {
            return this.query(q + ':contains("' + text + '")');
        };
        return Webot;
    })();
    exports.Webot = Webot;

    var WebotElement = (function () {
        function WebotElement(frame, q) {
            this.frame = frame;
            if (typeof q == 'string')
                this.el = frame.$(q);
            else
                this.el = q;
        }
        WebotElement.prototype.click = function () {
            this.el['simulateClick']();
        };

        WebotElement.prototype.length = function () {
            return this.el.length;
        };

        WebotElement.prototype.filter = function (predicate) {
            return new WebotElement(this.frame, this.el.filter(predicate));
        };

        WebotElement.prototype.contains = function (text) {
            var _this = this;
            return this.filter(function () {
                return _this.frame.$(this).text().indexOf(text) != -1;
            });
        };

        WebotElement.prototype.text = function (text) {
            var _this = this;
            return this.filter(function () {
                return _this.frame.$(this).clone().children().remove().end().text().trim() == text.trim();
            });
        };

        WebotElement.prototype.child = function (q) {
            return new WebotElement(this.frame, this.frame.$(q, this.el));
        };

        WebotElement.prototype.exists = function (expectation) {
            return this.length() == (expectation != false ? 1 : 0);
        };

        WebotElement.prototype.existMany = function () {
            return this.length() != 0;
        };

        WebotElement.prototype.$ = function () {
            return this.el;
        };
        return WebotElement;
    })();
    exports.WebotElement = WebotElement;
});
