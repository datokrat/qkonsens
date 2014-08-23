var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../konsenskistemodel', '../kernaussagemodel'], function(require, exports, unit, test, koki, ka) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.factory = new KonsenskisteFactory();
            this.kaFactory = new KernaussageFactory();
        }
        Tests.prototype.testChildKaArray = function () {
            var konsenskiste = this.factory.create('Basisdemokratie (Konzept)');
            var kernaussage = this.kaFactory.create('Begriff Basisdemokratie');

            konsenskiste.appendKa(kernaussage);

            test.assert(function () {
                return konsenskiste.getChildKaArray()[0] == kernaussage;
            });
        };

        Tests.prototype.testRemoveKa = function () {
            var konsenskiste = this.factory.create('Basisdemokratie');
            var kernaussage = this.kaFactory.create('Begriff Basisdemokratie');

            konsenskiste.appendKa(kernaussage);
            konsenskiste.removeKa(kernaussage);

            test.assert(function () {
                return konsenskiste.getChildKaArray().length == 0;
            });
        };

        Tests.prototype.testRemoveKa2 = function () {
            var konsenskiste = this.factory.create('Basisdemokratie');

            konsenskiste.appendKa(this.kaFactory.create('Begriff Basisdemokratie'));
            konsenskiste.removeKa(this.kaFactory.create('Begriff Basisdemokratie'));

            test.assert(function () {
                return konsenskiste.getChildKaArray().length == 1;
            });
        };

        Tests.prototype.testKaEvents = function () {
            var konsenskiste = this.factory.create('Basisdemokratie');
            var kernaussage = this.kaFactory.create('Begriff Basisdemokratie');

            var insertionCtr = 0;
            var insertionListener = function (args) {
                test.assert(function () {
                    return args.childKa == kernaussage;
                });
                ++insertionCtr;
            };

            var removalCtr = 0;
            var removalListener = function (args) {
                test.assert(function () {
                    return args.childKa == kernaussage;
                });
                ++removalCtr;
            };

            konsenskiste.childKaInserted.subscribe(insertionListener);
            konsenskiste.childKaRemoved.subscribe(removalListener);

            konsenskiste.appendKa(kernaussage);
            test.assert(function () {
                return insertionCtr == 1;
            });
            test.assert(function () {
                return removalCtr == 0;
            });

            konsenskiste.removeKa(kernaussage);
            test.assert(function () {
                return insertionCtr == 1;
            });
            test.assert(function () {
                return removalCtr == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var KonsenskisteFactory = (function () {
        function KonsenskisteFactory() {
        }
        KonsenskisteFactory.prototype.create = function (title, text) {
            var konsenskiste = new koki.Model();
            konsenskiste.content.title(title);
            konsenskiste.content.text(text);
            return konsenskiste;
        };
        return KonsenskisteFactory;
    })();

    var KernaussageFactory = (function () {
        function KernaussageFactory() {
        }
        KernaussageFactory.prototype.create = function (title) {
            var kernaussage = new ka.Model();
            kernaussage.content.title(title);
            return kernaussage;
        };
        return KernaussageFactory;
    })();
});
