var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', '../common', 'tests/testcontentcommunicator', '../contentmodel', '../contentviewmodel', '../contentcontroller'], function(require, exports, unit, test, common, TestContentCommunicator, ContentModel, ContentViewModel, ContentController) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.setUp = function () {
            this.com = new TestContentCommunicator;
            this.mdl = new ContentModel.Model;
            this.vm = new ContentViewModel.ViewModel;
            this.ctr = new ContentController.Controller(this.mdl, this.vm);
        };

        TestClass.prototype.queryContent = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    var content1 = new ContentModel.Model;
                    content1.id = 1;
                    content1.title('Title #1');
                    content1.text('Text #1');

                    _this.mdl.id = 1;

                    _this.com.setTestContent(content1);
                    _this.com.queryContent(1);

                    setTimeout(r, 0);
                },
                function (r) {
                    test.assert(function () {
                        return _this.mdl.title() == 'Title #1';
                    });
                    test.assert(function () {
                        return _this.mdl.text() == 'Text #1';
                    });
                }
            ], r);
        };
        return TestClass;
    })(unit.TestClass);
});
