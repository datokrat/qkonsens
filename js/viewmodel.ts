import topicNavigation = require('topicnavigationviewmodel')
import frame = require('frame')
import BrowseWin = require('windows/browse');
import KonsenskisteWin = require('windows/konsenskiste');
import Obs = require('observable');

export class ViewModel {
	//public topicNavigation = new topicNavigation.ViewModel();
	
	public left: frame.WinContainer;
	public right: frame.WinContainer;
	public center: frame.WinContainer;
	
	//public browseWin: BrowseWin.Win;
	public kkWin: KonsenskisteWin.Win;
	
	public userName: Obs.Observable<string>;
}