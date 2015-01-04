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

            konsenskiste.childKas.push(kernaussage);

            test.assert(function () {
                return konsenskiste.childKas.get()[0] == kernaussage;
            });
        };

        Tests.prototype.testRemoveKa = function () {
            var konsenskiste = this.factory.create('Basisdemokratie');
            var kernaussage = this.kaFactory.create('Begriff Basisdemokratie');

            konsenskiste.childKas.push(kernaussage);
            konsenskiste.childKas.remove(kernaussage);

            test.assert(function () {
                return konsenskiste.childKas.get().length == 0;
            });
        };

        Tests.prototype.testRemoveKa2 = function () {
            var konsenskiste = this.factory.create('Basisdemokratie');

            konsenskiste.childKas.push(this.kaFactory.create('Begriff Basisdemokratie'));
            konsenskiste.childKas.remove(this.kaFactory.create('Begriff Basisdemokratie'));

            test.assert(function () {
                return konsenskiste.childKas.get().length == 1;
            });
        };

        Tests.prototype.testKaEvents = function () {
            var konsenskiste = this.factory.create('Basisdemokratie');
            var kernaussage = this.kaFactory.create('Begriff Basisdemokratie');

            var insertionCtr = 0;
            var insertionListener = function (ka) {
                test.assert(function () {
                    return ka == kernaussage;
                });
                ++insertionCtr;
            };

            var removalCtr = 0;
            var removalListener = function (ka) {
                test.assert(function () {
                    return ka == kernaussage;
                });
                ++removalCtr;
            };

            konsenskiste.childKas.pushed.subscribe(insertionListener);
            konsenskiste.childKas.removed.subscribe(removalListener);

            konsenskiste.childKas.push(kernaussage);
            test.assert(function () {
                return konsenskiste.childKas.get().length == 1;
            });
            test.assert(function () {
                return konsenskiste.childKas.get()[0] == kernaussage;
            });
            test.assert(function () {
                return insertionCtr == 1;
            });
            test.assert(function () {
                return removalCtr == 0;
            });

            konsenskiste.childKas.remove(kernaussage);
            test.assert(function () {
                return konsenskiste.childKas.get().length == 0;
            });
            test.assert(function () {
                return insertionCtr == 1;
            });
            test.assert(function () {
                return removalCtr == 1;
            });
        };

        Tests.prototype.set = function () {
            var kModel = this.factory.create('Test');
            kModel.childKas.push(this.kaFactory.create('Ka'));

            var kModel2 = this.factory.create('Test');

            kModel2.set(kModel);
            test.assert(function () {
                return kModel.childKas.get().length == 1;
            });
            test.assert(function () {
                return kModel2.childKas.get().length == 1;
            });

            kModel2.set(kModel);
            test.assert(function () {
                return kModel.childKas.get().length == 1;
            });
            test.assert(function () {
                return kModel2.childKas.get().length == 1;
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
            konsenskiste.general().title(title);
            konsenskiste.general().text(text);
            return konsenskiste;
        };
        return KonsenskisteFactory;
    })();

    var KernaussageFactory = (function () {
        function KernaussageFactory() {
        }
        KernaussageFactory.prototype.create = function (title) {
            var kernaussage = new ka.Model();
            kernaussage.general().title(title);
            return kernaussage;
        };
        return KernaussageFactory;
    })();
});
