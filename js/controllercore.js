var ControllerChild = (function () {
    function ControllerChild(controller) {
        this.enabled = false;
        this.Controller = controller;
    }
    ControllerChild.prototype.setModel = function (m) {
        this.m = m;
        this.update();
    };

    ControllerChild.prototype.setViewModel = function (v) {
        this.v = v;
        this.update();
    };

    ControllerChild.prototype.setCommunicator = function (c) {
        this.c = c;
        this.update();
    };

    ControllerChild.prototype.enable = function () {
        this.enabled = true;
        this.update();
    };

    ControllerChild.prototype.disable = function () {
        this.enabled = false;
        this.disposeController();
    };

    ControllerChild.prototype.update = function () {
        if (this.enabled == false)
            return;

        this.disposeController();
        this.initController();
    };

    ControllerChild.prototype.disposeController = function () {
        if (this.controller)
            this.controller.dispose();
    };

    ControllerChild.prototype.initController = function () {
        this.controller = new this.Controller(this.m(), this.v(), this.c());
    };

    ControllerChild.prototype.dispose = function () {
        this.disposeController();
    };
    return ControllerChild;
})();

var ControllerCore = (function () {
    function ControllerCore() {
        this.children = [];
    }
    ControllerCore.prototype.child = function (ConstructorClass, mFn, vFn, cFn) {
        var child = new ControllerChild(ConstructorClass);
        child.setModel(mFn);
        child.setViewModel(vFn);
        child.setCommunicator(cFn);
        child.enable();

        this.children.push(child);

        return child;
    };

    ControllerCore.prototype.dispose = function () {
        this.children.forEach(function (child) {
            child.dispose();
        });
    };
    return ControllerCore;
})();

var IController = (function () {
    function IController() {
    }
    IController.prototype.dispose = function () {
    };
    return IController;
})();
