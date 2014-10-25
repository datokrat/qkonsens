define(["require", "exports"], function(require, exports) {
    var idCtr = 0;
    var next = function () {
        return ++idCtr;
    };
    
    return next;
});
