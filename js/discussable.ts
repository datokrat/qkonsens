import Obs = require('observable')
import DiscussableCommunicator = require('discussablecommunicator')
import Comment = require('comment')
import CommentSynchronizer = require('synchronizers/comment')
import ViewModelContext = require('viewmodelcontext')

export interface Model {
	id: number;
	comments: Obs.ObservableArrayEx<Comment.Model>;
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
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.viewModelContext = cxt;
	}
	
	public dispose() {
		this.commentSynchronizer.dispose();
	}
	
	private discussionClick = () => {
		if(this.viewModelContext) {
			this.communicator.queryCommentsOf(this.model.id);
			this.viewModelContext.discussionWindow.discussable(this.viewModel);
			this.viewModelContext.setLeftWindow(this.viewModelContext.discussionWindow);
		}
	}
	
	private viewModelContext: ViewModelContext;
	private commentSynchronizer: CommentSynchronizer;
}