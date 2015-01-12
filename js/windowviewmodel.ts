import frame = require('frame');

export class Main {
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