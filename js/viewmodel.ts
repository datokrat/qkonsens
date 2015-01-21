import topicNavigation = require('topicnavigationviewmodel')
import frame = require('frame')
import BrowseWin = require('windows/browse');
import KonsenskisteWin = require('windows/konsenskiste');
import Obs = require('observable');

export class ViewModel {
	public left: frame.WinContainer;
	public right: frame.WinContainer;
	public center: frame.WinContainer;
	
	public userName: Obs.Observable<string>;
	public isAdmin: Obs.Observable<boolean>;
	public availableAccounts: Obs.ObservableArray<string>;
}