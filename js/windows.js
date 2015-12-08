var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'command', 'memory', 'windows/newkk', 'windows/intro', 'windows/editkelement', 'windows/discussion', 'windows/environs', 'kelementcommands'], function (require, exports, Commands, Memory, NewKkWin, IntroWin, EditKElementWin, DiscussionWindow, EnvironsWindow, KElementCommands) {
    var WindowLogic = (function () {
        function WindowLogic(windowViewModel, windows, commandProcessor) {
            this.windowViewModel = windowViewModel;
            this.windows = windows;
            this.commandProcessor = commandProcessor;
            this.disposables = new Memory.DisposableContainer();
            this.initCommandProcessor();
        }
        WindowLogic.prototype.initCommandProcessor = function () {
            var _this = this;
            this.disposables.append(this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof OpenNewKokiWindowCommand) {
                    var openNewKokiWindowCommand = cmd;
                    _this.windows.newKkWindow.model.setParentTopic(openNewKokiWindowCommand.topic);
                    _this.windowViewModel.fillFrameWithWindow(Frame.Left, _this.windows.newKkWindow.frame);
                    return true;
                }
                if (cmd instanceof KElementCommands.OpenEditKElementWindowCommand) {
                    var editKElementWindowCommand = cmd;
                    _this.windows.editKElementWindow.model.setKElementModel(editKElementWindowCommand.model);
                    _this.windowViewModel.fillFrameWithWindow(Frame.Left, _this.windows.editKElementWindow.frame);
                    return true;
                }
                if (cmd instanceof OpenDiscussionWindowCommand) {
                    var openDiscussionWindowCommand = cmd;
                    _this.windows.discussionFrame.discussable(cmd.discussableViewModel);
                    _this.windowViewModel.fillFrameWithWindow(Frame.Left, _this.windows.discussionFrame);
                    return true;
                }
                if (cmd instanceof OpenEnvironsWindowCommand) {
                    _this.windowViewModel.fillFrameWithWindow(Frame.Left, _this.windows.environsWindow);
                    return true;
                }
            }));
        };
        WindowLogic.prototype.dispose = function () {
            this.disposables.dispose();
        };
        return WindowLogic;
    })();
    exports.WindowLogic = WindowLogic;
    var Windows = (function () {
        function Windows(commandProcessor) {
            this.introFrame = new IntroWin.Win();
            this.discussionFrame = new DiscussionWindow.Win();
            this.newKkWindow = NewKkWin.Main.CreateEmpty(commandProcessor);
            this.editKElementWindow = EditKElementWin.Main.CreateEmpty(commandProcessor);
            this.environsWindow = new EnvironsWindow.Win(commandProcessor);
            console.log(commandProcessor);
        }
        Windows.prototype.dispose = function () {
            this.newKkWindow.dispose();
            this.editKElementWindow.dispose();
        };
        return Windows;
    })();
    exports.Windows = Windows;
    var WindowViewModel = (function () {
        function WindowViewModel(winContainers) {
            this.winContainers = winContainers;
        }
        WindowViewModel.prototype.fillFrameWithWindow = function (frame, window) {
            this.getWinContainerOfFrame(frame).win(window);
        };
        WindowViewModel.prototype.getWindowOfFrame = function (frame) {
            return this.getWinContainerOfFrame(frame).win();
        };
        WindowViewModel.prototype.getWinContainerOfFrame = function (frame) {
            switch (frame) {
                case Frame.Center: return this.winContainers.center;
                case Frame.Left: return this.winContainers.left;
                case Frame.Right: return this.winContainers.right;
                default: throw new Error('unknown value of Frame');
            }
        };
        return WindowViewModel;
    })();
    exports.WindowViewModel = WindowViewModel;
    (function (Frame) {
        Frame[Frame["Center"] = 0] = "Center";
        Frame[Frame["Left"] = 1] = "Left";
        Frame[Frame["Right"] = 2] = "Right";
    })(exports.Frame || (exports.Frame = {}));
    var Frame = exports.Frame;
    ;
    var OpenNewKokiWindowCommand = (function (_super) {
        __extends(OpenNewKokiWindowCommand, _super);
        function OpenNewKokiWindowCommand(topic) {
            _super.call(this);
            this.topic = topic;
        }
        return OpenNewKokiWindowCommand;
    })(Commands.Command);
    exports.OpenNewKokiWindowCommand = OpenNewKokiWindowCommand;
    var OpenDiscussionWindowCommand = (function (_super) {
        __extends(OpenDiscussionWindowCommand, _super);
        function OpenDiscussionWindowCommand(discussableViewModel) {
            _super.call(this);
            this.discussableViewModel = discussableViewModel;
        }
        return OpenDiscussionWindowCommand;
    })(Commands.Command);
    exports.OpenDiscussionWindowCommand = OpenDiscussionWindowCommand;
    var OpenEnvironsWindowCommand = (function (_super) {
        __extends(OpenEnvironsWindowCommand, _super);
        function OpenEnvironsWindowCommand() {
            _super.call(this);
        }
        return OpenEnvironsWindowCommand;
    })(Commands.Command);
    exports.OpenEnvironsWindowCommand = OpenEnvironsWindowCommand;
});
