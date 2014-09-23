var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', '../common', 'tests/testcontentcommunicator', '../contentmodel', '../contentviewmodel', '../contentcontroller', 'factories/contentmodel'], function(require, exports, unit, test, common, TestContentCommunicator, ContentModel, ContentViewModel, ContentController, ContentModelFactory) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
            this.contentModelFactory = new ContentModelFactory;
        }
        TestClass.prototype.setUp = function (r) {
            this.com = new TestContentCommunicator;
            this.mdl = new ContentModel.WithContext;
            this.vm = new ContentViewModel.ViewModel;
            this.ctr = new ContentController.Controller(this.mdl, this.vm, this.com);

            this.content1 = this.contentModelFactory.createWithContext('Text #1', 'Title #1');
            this.content1.id = 1;
            this.content1.context().text('Context #1');
            this.content2 = this.contentModelFactory.create('Text #2', 'Title #2');
            this.content2.id = 2;

            this.com.setTestContent(this.content1);
            this.com.setTestContent(this.content2);
            r();
        };

        TestClass.prototype.queryContent = function (cxt, r) {
            var _this = this;
            common.Callbacks.batch([
                function (r) {
                    _this.mdl.id = 1;
                    _this.com.queryContent(1);
                    setTimeout(r);
                },
                function (r) {
                    _this.com.queryContent(2);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () {
                        return _this.mdl.title() == 'Title #1';
                    });
                    test.assert(function () {
                        return _this.mdl.text() == 'Text #1';
                    });
                    r();
                }
            ], r);
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
