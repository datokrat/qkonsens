var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var idCtr = 0;

    var Model = (function () {
        function Model(mtr) {
            var _this = this;
            this.id = idCtr++;
            this.user = ko.observable('anonymous');
            this.kk = ko.observable();
            this.topicBreadcrumb = ko.observableArray([new Topic(null)]);
            this.topic = ko.computed(function () {
                return _this.topicBreadcrumb()[_this.topicBreadcrumb().length - 1];
            });
            this.mtr = mtr;
            mtr.setAuthDataFunction(function () {
                return ({ user: _this.user(), password: 'none' });
            });
        }
        Model.prototype.selectChildTopic = function (child) {
            this.topicBreadcrumb.push(child);
        };

        Model.prototype.selectBreadcrumbTopic = function (parent) {
            var i = this.topicBreadcrumb.indexOf(parent);
            if (i != -1)
                this.topicBreadcrumb.splice(i + 1);
        };

        Model.prototype.selectTopic = function (topic, role) {
            switch (role) {
                case 1 /* Child */:
                    this.selectChildTopic(topic);
                    break;
                case 0 /* Breadcrumb */:
                    this.selectBreadcrumbTopic(topic);
                    break;
            }
        };
        return Model;
    })();
    exports.Model = Model;

    (function (TopicRole) {
        TopicRole[TopicRole["Breadcrumb"] = 0] = "Breadcrumb";
        TopicRole[TopicRole["Child"] = 1] = "Child";
    })(exports.TopicRole || (exports.TopicRole = {}));
    var TopicRole = exports.TopicRole;

    var QkElementBase = (function () {
        function QkElementBase(id) {
            var _this = this;
            this.type = 'none';
            this.title = ko.observable();
            this.text = ko.observable();
            this.rating = ko.observable('like');
            this.likeRating = ko.computed({
                read: function () {
                    switch (_this.rating()) {
                        case 'like':
                        case 'stronglike':
                            return 'like';
                        case 'dislike':
                        case 'strongdislike':
                            return 'dislike';
                        default:
                            return 'none';
                    }
                },
                write: function (val) {
                    alert('not implemented');
                }
            });
            this.stronglikeSum = ko.observable();
            this.likeSum = ko.observable();
            this.neutralSum = ko.observable();
            this.dislikeSum = ko.observable();
            this.strongdislikeSum = ko.observable();
            this.id = id;
        }
        return QkElementBase;
    })();
    exports.QkElementBase = QkElementBase;

    var QkMainElementBase = (function (_super) {
        __extends(QkMainElementBase, _super);
        function QkMainElementBase(id) {
            _super.call(this, id);
            this.comments = ko.observableArray();
            this.context = ko.observable();
        }
        return QkMainElementBase;
    })(QkElementBase);
    exports.QkMainElementBase = QkMainElementBase;

    var KonsenskisteImpl = (function (_super) {
        __extends(KonsenskisteImpl, _super);
        function KonsenskisteImpl(id) {
            _super.call(this, id);
            this.children = ko.observableArray();
            this.type = 'kk';
        }
        return KonsenskisteImpl;
    })(QkMainElementBase);
    exports.KonsenskisteImpl = KonsenskisteImpl;

    var KernaussageImpl = (function (_super) {
        __extends(KernaussageImpl, _super);
        function KernaussageImpl(id, parent) {
            _super.call(this, id);
            this.parent = ko.observable();
            this.children = ko.observableArray();
            this.context = ko.observable();
            this.type = 'ka';

            this.parent(parent);
        }
        return KernaussageImpl;
    })(QkMainElementBase);
    exports.KernaussageImpl = KernaussageImpl;

    var Kommentar = (function (_super) {
        __extends(Kommentar, _super);
        function Kommentar(id, parent) {
            _super.call(this, id);
            this.parent = ko.observable();
            this.type = 'cmt';

            this.parent(parent);
        }
        return Kommentar;
    })(QkElementBase);
    exports.Kommentar = Kommentar;

    var Topic = (function () {
        function Topic(id, parent) {
            this.parent = ko.observable();
            this.children = ko.observableArray();
            this.kks = ko.observableArray();
            this.title = ko.observable();
            this.text = ko.observable();
            this.id = id;
            this.parent(parent);
        }
        return Topic;
    })();
    exports.Topic = Topic;
});
