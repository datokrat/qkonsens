define(["require", "exports", 'topicnavigationmodel'], function(require, exports, topicNavigation) {
    var ModelImpl = (function () {
        function ModelImpl() {
            this.topicNavigation = new topicNavigation.ModelImpl;
            this.konsenskiste = ko.observable();
            this.account = ko.observable(new Account);
        }
        return ModelImpl;
    })();
    exports.ModelImpl = ModelImpl;

    var Account = (function () {
        function Account(args) {
            if (typeof args === "undefined") { args = { userName: 'anonymous' }; }
            this.userName = args.userName;
        }
        Account.prototype.eq = function (other) {
            return other.userName == this.userName;
        };
        return Account;
    })();
    exports.Account = Account;
});
