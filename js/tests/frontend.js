define(["require", "exports", 'tests/tsunit'], function(require, exports, unit) {
    $(function () {
        if (window.location.search == '?test') {
            console.log('test mode');

            var test = new unit.Test();

            test.showResults(document.getElementById('tests'), test.run());
        }
    });

    $.fn.simulateClick = function () {
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

    exports.x = null;
});
