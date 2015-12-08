import frame = require('frame');
import Commands = require('command');
import Memory = require('memory');

import NewKkWin = require('windows/newkk');
import IntroWin = require('windows/intro');
import EditKElementWin = require('windows/editkelement');

import DiscussionWindow = require('windows/discussion')
import EnvironsWindow = require('windows/environs');

import Topic = require('topic');
import Discussion = require('discussion');
import KElementCommands = require('kelementcommands');

export class WindowLogic {
	constructor(private windowViewModel: WindowViewModel, private windows: Windows, private commandProcessor: Commands.CommandProcessor) {
		this.initCommandProcessor();
	}
	
	private initCommandProcessor() {
		this.disposables.append(
			this.commandProcessor.chain.append(cmd => {
				if(cmd instanceof OpenNewKokiWindowCommand) {
					var openNewKokiWindowCommand = <OpenNewKokiWindowCommand>cmd;
					this.windows.newKkWindow.model.setParentTopic(openNewKokiWindowCommand.topic);
					this.windowViewModel.fillFrameWithWindow(Frame.Left, this.windows.newKkWindow.frame);
					return true;
				}
				if(cmd instanceof KElementCommands.OpenEditKElementWindowCommand) {
					var editKElementWindowCommand = <KElementCommands.OpenEditKElementWindowCommand>cmd;
					this.windows.editKElementWindow.model.setKElementModel(editKElementWindowCommand.model);
					this.windowViewModel.fillFrameWithWindow(Frame.Left, this.windows.editKElementWindow.frame);
					return true;
				}
				if(cmd instanceof OpenDiscussionWindowCommand) {
					var openDiscussionWindowCommand = <OpenDiscussionWindowCommand>cmd;
					this.windows.discussionFrame.discussable((<OpenDiscussionWindowCommand>cmd).discussableViewModel);
					this.windowViewModel.fillFrameWithWindow(Frame.Left, this.windows.discussionFrame);
					return true;
				}
				if(cmd instanceof OpenEnvironsWindowCommand) {
					this.windowViewModel.fillFrameWithWindow(Frame.Left, this.windows.environsWindow);
					return true;
				}
			})
		);
	}
	
	public dispose() {
		this.disposables.dispose();
	}
	
	private disposables = new Memory.DisposableContainer();
}

export class Windows {
	public newKkWindow: NewKkWin.Main;
	public editKElementWindow: EditKElementWin.Main;
	public environsWindow: EnvironsWindow.Win;
	
	public introFrame = new IntroWin.Win();
	public discussionFrame = new DiscussionWindow.Win();
	
	constructor(commandProcessor: Commands.CommandProcessor) {
		this.newKkWindow = NewKkWin.Main.CreateEmpty(commandProcessor);
		this.editKElementWindow = EditKElementWin.Main.CreateEmpty(commandProcessor);
		this.environsWindow = new EnvironsWindow.Win(commandProcessor);
        console.log(commandProcessor);
	}
	
	public dispose() {
		this.newKkWindow.dispose();
		this.editKElementWindow.dispose();
	}
}

export class WindowViewModel {
	constructor(private winContainers: { center: frame.WinContainer; left: frame.WinContainer; right: frame.WinContainer }) {}
	
	public fillFrameWithWindow(frame: Frame, window: frame.Win) {
		this.getWinContainerOfFrame(frame).win(window);
	}
	
	public getWindowOfFrame(frame: Frame): frame.Win {
		return this.getWinContainerOfFrame(frame).win();
	}
	
	private getWinContainerOfFrame(frame: Frame) {
		switch(frame) {
			case Frame.Center: return this.winContainers.center;
			case Frame.Left: return this.winContainers.left;
			case Frame.Right: return this.winContainers.right;
			default: throw new Error('unknown value of Frame');
		}
	}
}

export enum Frame { Center, Left, Right };



export class OpenNewKokiWindowCommand extends Commands.Command {
	constructor(public topic: Topic.Model) { super() }
}

export class OpenDiscussionWindowCommand extends Commands.Command {
	constructor(public discussableViewModel: Discussion.DiscussableViewModel) { super() }
}

export class OpenEnvironsWindowCommand extends Commands.Command {
	constructor() { super() }
}