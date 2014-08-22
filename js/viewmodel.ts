import topicNavigation = require('topicnavigationviewmodel')
import frame = require('frame')

export class ViewModel {
	public topicNavigation = new topicNavigation.ViewModel();
	
	public left: frame.WinContainer;
	public right: frame.WinContainer;
	public center: frame.WinContainer;
}