var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../contentmodel'], function(require, exports, unit, test, ContentModel) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.apply(this, arguments);
        }
        Main.prototype.testSetModel = function () {
            var m1 = new ContentModel.General();
            m1.title('title1');
            m1.text('text1');

            var m2 = new ContentModel.General();
            m2.title('title2');
            m2.text('text2');

            m1.set(m2);

            test.assert(function () {
                return m1.title() == 'title2';
            });
            test.assert(function () {
                return m1.text() == 'text2';
            });
        };
        return Main;
    })(unit.TestClass);

    
    return Main;
});
