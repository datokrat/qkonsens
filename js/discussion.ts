import Obs = require('observable')
import Events = require('event')
import Common = require('common');
import DiscussionCommunicator = require('discussioncommunicator')
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
	
	removeComment: (comment: Comment.Model) => void;
}

export class ViewModel {
	comments: Obs.ObservableArray<Comment.ViewModel>;
	commentsLoaded: Obs.Observable<boolean>;
	commentsLoading: Obs.Observable<boolean>;
	error: Obs.Observable<string>;
	discussionClick: () => void;
	
	submitCommentClick: () => void;
	newCommentText: Obs.Observable<string>;
	newCommentDisabled: Obs.Observable<boolean>;
}

export class Controller {
	constructor(private model: Model, private viewModel: ViewModel, private communicator: DiscussionCommunicator.Base) {
		this.viewModel.comments = ko.observableArray<Comment.ViewModel>();
		this.viewModel.discussionClick = this.discussionClick;
		this.viewModel.commentsLoading = this.model.commentsLoading;
		this.viewModel.commentsLoaded = this.model.commentsLoaded;
		this.viewModel.error = this.model.error;
		
		this.viewModel.newCommentDisabled = ko.observable<boolean>(false);
		this.viewModel.newCommentText = ko.observable<string>();
		this.viewModel.submitCommentClick = () => {
			var comment = new Comment.Model();
			comment.content().text(this.viewModel.newCommentText());
			this.viewModel.newCommentText('');
			this.viewModel.newCommentDisabled(true);
			communicator.appendComment(this.discussableModel.id(), comment);
		};
		
		this.model.removeComment = (comment: Comment.Model) => {
			this.communicator.removeComment({ discussableId: this.discussableModel.id(), commentId: comment.id });
		};
		
		this.commentSynchronizer = new CommentSynchronizer(this.communicator.content)
			.setViewModelObservable(this.viewModel.comments)
			.setModelObservable(this.model.comments);
		this.commentSynchronizer.itemCreated.subscribe(args => {
			args.controller.setCommentableModel(this.model);
		});
		
		this.communicatorSubscriptions = [
			this.communicator.commentsReceived.subscribe(this.onCommentsReceived),
			this.communicator.commentsReceiptError.subscribe(this.onCommentsReceiptError),
			this.communicator.commentAppended.subscribe(this.onCommentAppended.bind(this)),
			this.communicator.commentAppendingError.subscribe(this.onCommentAppendingError.bind(this)),
			this.communicator.commentRemoved.subscribe(this.onCommentRemoved.bind(this)),
			this.communicator.commentRemovalError.subscribe(this.onCommentRemovalError.bind(this)),
		];
	}
	
	public onCommentRemoved(args: DiscussionCommunicator.RemovedArgs) {
		if(args.discussableId == this.discussableModel.id()) {
			this.model.comments.removeByPredicate(c => c.id == args.commentId);
		}
	}
	
	public onCommentRemovalError(args: DiscussionCommunicator.RemovalErrorArgs) {
		if(args.discussableId == this.discussableModel.id()) {
			console.error('comment[' + args.commentId + '] could not be removed');
		}
	}
	
	public onCommentAppended(args: DiscussionCommunicator.AppendedArgs) {
		if(args.discussableId == this.discussableModel.id()) {
			this.communicator.queryCommentsOf(this.discussableModel.id());
			this.viewModel.newCommentDisabled(false);
		}
	}
	
	public onCommentAppendingError(args: DiscussionCommunicator.AppendingErrorArgs) {
		if(args.discussableId == this.discussableModel.id()) {
			alert('Beitrag konnte nicht erstellt werden. Bitte lade die Seite neu!');
		}
	}
	
	public setDiscussableModel(discussableModel: DiscussableModel) {
		this.discussableModel = discussableModel;
		return this;
	}
	
	public setDiscussableViewModel(discussableViewModel: DiscussableViewModel) {
		this.discussableViewModel = discussableViewModel;
		return this;
	}
	
	private onCommentsReceived = (args: DiscussionCommunicator.ReceivedArgs) => {
		if(this.discussableModel && this.discussableModel.id() == args.id) {
			this.model.comments.set(args.comments);
			this.model.commentsLoading(false);
			this.model.commentsLoaded(true);
		}
		else if(!this.discussableModel)
			throw new Error('this.discussableModel is null/undefined');
	}
	
	private onCommentsReceiptError = (args: DiscussionCommunicator.CommentsReceiptErrorArgs) => {
		if(this.discussableModel && this.discussableModel.id() == args.discussableId) {
			this.model.error(args.message);
			this.model.commentsLoading(false);
			this.model.commentsLoaded(false);
		}
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.viewModelContext = cxt;
		return this;
	}
	
	public dispose() {
		this.commentSynchronizer.dispose();
		this.communicatorSubscriptions.forEach(s => s.dispose());
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