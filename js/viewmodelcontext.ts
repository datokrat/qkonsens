import Obs = require('observable')
import frame = require('frame')
import DiscussionWindow = require('windows/discussion')

class ViewModelContext {
	constructor(left: frame.WinContainer, right: frame.WinContainer, center: frame.WinContainer) {
		this.left = left;
		this.right = right;
		this.center = center;
	}

	public setLeftWindow(win: frame.Win) {
		this.left.win(win);
	}
	public setRightWindow(win: frame.Win) {
		this.right.win(win);
	
	}
	public setCenterWindow(win: frame.Win) {
		this.center.win(win);
	}
	
	public konsenskisteWindow: frame.Win;
	public discussionWindow: DiscussionWindow.Win;
	
	private left: frame.WinContainer;
	private right: frame.WinContainer;
	private center: frame.WinContainer;
}

export = ViewModelContext;