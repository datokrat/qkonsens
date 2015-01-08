define(["require", "exports"], function(require, exports) {
    var Main = (function () {
        function Main(winContainers) {
            this.winContainers = winContainers;
        }
        Main.prototype.fillFrameWithWindow = function (frame, window) {
            this.getWinContainerOfFrame(frame).win(window);
        };

        Main.prototype.getWinContainerOfFrame = function (frame) {
            switch (frame) {
                case 0 /* Center */:
                    return this.winContainers.center;
                case 1 /* Left */:
                    return this.winContainers.left;
                case 2 /* Right */:
                    return this.winContainers.right;
                default:
                    throw new Error('unknown value of Frame');
            }
        };
        return Main;
    })();
    exports.Main = Main;

    (function (Frame) {
        Frame[Frame["Center"] = 0] = "Center";
        Frame[Frame["Left"] = 1] = "Left";
        Frame[Frame["Right"] = 2] = "Right";
    })(exports.Frame || (exports.Frame = {}));
    var Frame = exports.Frame;
    ;
});
