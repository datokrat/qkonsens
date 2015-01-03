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
            this.generalModel = new ContentModel.General;
            this.generalViewModel = new ContentViewModel.General;
            this.generalController = new ContentController.General(this.generalModel, this.generalViewModel, this.com);
            this.contextModel = new ContentModel.Context;
            this.contextViewModel = new ContentViewModel.Context;
            this.contextController = new ContentController.Context(this.contextModel, this.contextViewModel, this.com);

            this.content1 = this.contentModelFactory.createGeneralContent('Text #1', 'Title #1');
            this.content1.id = 1;
            this.content2 = this.contentModelFactory.createGeneralContent('Text #2', 'Title #2');
            this.content2.id = 2;

            this.context1 = this.contentModelFactory.createContext('Context #1');
            this.context1.id = 10;

            this.com.setGeneralTestContent(this.content1);
            this.com.setGeneralTestContent(this.content2);
            this.com.setTestContext(this.context1);
            r();
        };

        TestClass.prototype.queryContent = function (async, r) {
            var _this = this;
            async();
            common.Callbacks.batch([
                function (r) {
                    _this.generalModel.id = 1;
                    _this.contextModel.id = 10;
                    _this.com.queryGeneral(1);
                    _this.com.queryContext(10);
                    setTimeout(r);
                },
                function (r) {
                    _this.com.queryGeneral(2);
                    setTimeout(r);
                },
                function (r) {
                    test.assert(function () {
                        return _this.generalModel.title() == 'Title #1';
                    });
                    test.assert(function () {
                        return _this.generalModel.text() == 'Text #1';
                    });
                    test.assert(function () {
                        return _this.contextModel.text() == 'Context #1';
                    });
                    r();
                }
            ], r);
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
