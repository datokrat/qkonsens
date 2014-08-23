///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'tests/tsunit', 'frontendtests/kokiwin'], function(require, exports, unit, kokiWin) {
    setTimeout(function () {
        console.log('test mode');

        var test = new unit.Test();

        test.addTestClass(new kokiWin.Tests());

        test.showResults(document.getElementById('tests'), test.run());
    }, 4000);
});
