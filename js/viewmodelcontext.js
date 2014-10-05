define(["require", "exports"], function(require, exports) {
    var ViewModelContext = (function () {
        function ViewModelContext(left, right, center) {
            this.left = left;
            this.right = right;
            this.center = center;
        }
        ViewModelContext.prototype.setLeftWindow = function (win) {
            this.left.win(win);
        };
        ViewModelContext.prototype.setRightWindow = function (win) {
            this.right.win(win);
        };
        ViewModelContext.prototype.setCenterWindow = function (win) {
            this.center.win(win);
        };
        return ViewModelContext;
    })();

    
    return ViewModelContext;
});
