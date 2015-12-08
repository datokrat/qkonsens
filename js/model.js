define(["require", "exports", 'topicnavigationmodel', 'account'], function (require, exports, topicNavigation, Account) {
    var ModelImpl = (function () {
        function ModelImpl() {
            this.topicNavigation = new topicNavigation.ModelImpl;
            this.konsenskiste = ko.observable();
            this.account = ko.observable(new Account.Model);
        }
        return ModelImpl;
    })();
    exports.ModelImpl = ModelImpl;
});
