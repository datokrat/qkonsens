import Content = require('contentviewmodel')
import Comment = require('comment')
import Discussable = require('discussable')
import Obs = require('observable')

export class ViewModel {
	public general: Obs.Observable<Content.General>;
	public context: Obs.Observable<Content.Context>;
	public comments: Obs.ObservableArray<Comment.ViewModel>;
	
	public isActive: () => boolean;
	public discussionClick: () => void;
}