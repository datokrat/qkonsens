import Obs = require('observable')
import Events = require('event')
import DiscussableCommunicator = require('discussioncommunicator')
import Comment = require('comment')
import CommentSynchronizer = require('synchronizers/comment')
import ViewModelContext = require('viewmodelcontext')

export interface DiscussableModel {
	id: Obs.Observable<number>;
	discussion: Obs.Observable<Model>;
}

export interface DiscussableViewModel {
	discussion: Obs.Observable<ViewModel>;
}

export class Model {
	comments: Obs.ObservableArrayEx<Comment.Model> = new Obs.ObservableArrayExtender<Comment.Model>(ko.observableArray<Comment.Model>());
	commentsLoaded: Obs.Observable<boolean> = ko.observable<boolean>();
	commentsLoading: Obs.Observable<boolean> = ko.observable<boolean>();
	error: Obs.Observable<string> = ko.observable<string>();
}

export class ViewModel {
	comments: Obs.ObservableArray<Comment.ViewModel>;
	commentsLoaded: Obs.Observable<boolean>;
	commentsLoading: Obs.Observable<boolean>;
	error: Obs.Observable<string>;
	discussionClick: () => void;
}

export class Controller {
	constructor(private model: Model, private viewModel: ViewModel, private communicator: DiscussableCommunicator.Base) {
		this.viewModel.comments = ko.observableArray<Comment.ViewModel>();
		this.viewModel.discussionClick = this.discussionClick;
		this.viewModel.commentsLoading = this.model.commentsLoading;
		this.viewModel.commentsLoaded = this.model.commentsLoaded;
		this.viewModel.error = this.model.error;
		
		this.commentSynchronizer = new CommentSynchronizer(this.communicator.content)
			.setViewModelObservable(this.viewModel.comments)
			.setModelObservable(this.model.comments);
		
		this.communicatorSubscriptions = [
			this.communicator.commentsReceived.subscribe(this.onCommentsReceived),
		];
	}
	
	public setDiscussableModel(discussableModel: DiscussableModel) {
		this.discussableModel = discussableModel;
		return this;
	}
	
	public setDiscussableViewModel(discussableViewModel: DiscussableViewModel) {
		this.discussableViewModel = discussableViewModel;
		return this;
	}
	
	private onCommentsReceived = (args: DiscussableCommunicator.ReceivedArgs) => {
		if(this.discussableModel && this.discussableModel.id() == args.id) {
			this.model.comments.set(args.comments);
			this.model.commentsLoading(false);
			this.model.commentsLoaded(true);
		}
		else if(!this.discussableModel)
			throw new Error('this.discussableModel is null/undefined');
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.viewModelContext = cxt;
		return this;
	}
	
	public dispose() {
		this.commentSynchronizer.dispose();
		this.communicatorSubscriptions.forEach(s => s.undo());
	}
	
	private discussionClick = () => {
		if(this.viewModelContext) {
			if(this.discussableModel && !this.model.commentsLoading() && !this.model.commentsLoaded()) {
				this.model.commentsLoading(true);
				this.communicator.queryCommentsOf(this.discussableModel.id());
			}
			
			if(!this.discussableModel)
				this.model.error('DiscussionController.discussableModel is not defined');

			this.viewModelContext.discussionWindow.discussable(this.discussableViewModel);
			this.viewModelContext.setLeftWindow(this.viewModelContext.discussionWindow);
		}
        else console.warn('viewModelContext is null');
	}
	
	private discussableModel: DiscussableModel;
	private discussableViewModel: DiscussableViewModel;
	
	private viewModelContext: ViewModelContext;
	private commentSynchronizer: CommentSynchronizer;
	private communicatorSubscriptions: Events.Subscription[] = [];
}