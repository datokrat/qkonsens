import Obs = require('observable')
import Events = require('event')
import DiscussableCommunicator = require('discussablecommunicator')
import Comment = require('comment')
import CommentSynchronizer = require('synchronizers/comment')
import ViewModelContext = require('viewmodelcontext')

export interface Model {
	id: number;
	comments: Obs.ObservableArrayEx<Comment.Model>;
	commentsLoaded: Obs.Observable<boolean>;
	commentsLoading: Obs.Observable<boolean>;
}

export interface ViewModel {
	comments: Obs.ObservableArray<Comment.ViewModel>;
	discussionClick: () => void;
}

export class Controller {
	constructor(private model: Model, private viewModel: ViewModel, private communicator: DiscussableCommunicator.Base) {
		this.viewModel.comments = ko.observableArray<Comment.ViewModel>();
		this.viewModel.discussionClick = this.discussionClick;
		
		this.commentSynchronizer = new CommentSynchronizer(this.communicator.content)
			.setViewModelObservable(this.viewModel.comments)
			.setModelObservable(this.model.comments);
		
		this.communicatorSubscriptions = [
			this.communicator.commentsReceived.subscribe(this.onCommentsReceived),
		];
	}
	
	private onCommentsReceived = (args: DiscussableCommunicator.ReceivedArgs) => {
		if(this.model.id == args.id) {
			this.model.comments.set(args.comments);
			this.model.commentsLoading(false);
			this.model.commentsLoaded(true);
		}
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.viewModelContext = cxt;
	}
	
	public dispose() {
		this.commentSynchronizer.dispose();
		this.communicatorSubscriptions.forEach(s => s.undo());
	}
	
	private discussionClick = () => {
		if(this.viewModelContext) {
			if(!this.model.commentsLoading() && !this.model.commentsLoaded()) {
				this.model.commentsLoading(true);
				this.communicator.queryCommentsOf(this.model.id);
			}
			this.viewModelContext.discussionWindow.discussable(this.viewModel);
			this.viewModelContext.setLeftWindow(this.viewModelContext.discussionWindow);
		}
	}
	
	private viewModelContext: ViewModelContext;
	private commentSynchronizer: CommentSynchronizer;
	private communicatorSubscriptions: Events.Subscription[] = [];
}