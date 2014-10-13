import Content = require('contentviewmodel')
import Comment = require('comment')
import Discussion = require('discussable')
import Obs = require('observable')

export class ViewModel {
	public general: Obs.Observable<Content.General>;
	public context: Obs.Observable<Content.Context>;
	public discussion: Obs.Observable<Discussion.ViewModel>;
	
	public isActive: () => boolean;
	public discussionClick: () => void;
}