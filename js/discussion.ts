import Obs = require('observable')
import Events = require('event')
import Common = require('common');
import MainController = require('controller');
import DiscussionCommunicator = require('discussioncommunicator')
import Comment = require('comment')
import CommentSynchronizer = require('synchronizers/comment')
import ViewModelContext = require('viewmodelcontext')
import Commands = require('command');
import Windows = require('windows');

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

export interface ControllerArgs {
	communicator: DiscussionCommunicator.Base;
	commandProcessor: Commands.CommandProcessor;
}

export class Controller {
	constructor(private model: Model, private viewModel: ViewModel, private args: ControllerArgs) {
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
			args.communicator.appendComment(this.discussableModel.id(), comment);
		};
		
		this.model.removeComment = (comment: Comment.Model) => {
			this.args.communicator.removeComment({ discussableId: this.discussableModel.id(), commentId: comment.id });
		};
		
		this.commentSynchronizer = new CommentSynchronizer(this.args.communicator)
			.setViewModelObservable(this.viewModel.comments)
			.setModelObservable(this.model.comments);
		this.commentSynchronizer.itemCreated.subscribe(args => {
			args.controller.setCommentableModel(this.model);
		});
		
		this.communicatorSubscriptions = [
			this.args.communicator.commentsReceived.subscribe(this.onCommentsReceived),
			this.args.communicator.commentsReceiptError.subscribe(this.onCommentsReceiptError),
			this.args.communicator.commentAppended.subscribe(this.onCommentAppended.bind(this)),
			this.args.communicator.commentAppendingError.subscribe(this.onCommentAppendingError.bind(this)),
			this.args.communicator.commentRemoved.subscribe(this.onCommentRemoved.bind(this)),
			this.args.communicator.commentRemovalError.subscribe(this.onCommentRemovalError.bind(this)),
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
			this.args.communicator.queryCommentsOf(this.discussableModel.id());
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
		if(this.discussableModel && !this.model.commentsLoading() /*&& !this.model.commentsLoaded()*/) {
			this.model.commentsLoading(true);
			this.args.communicator.queryCommentsOf(this.discussableModel.id());
		}
		
		if(!this.discussableModel)
			this.model.error('DiscussionController.discussableModel is not defined');

		this.args.commandProcessor.processCommand(new Windows.OpenDiscussionWindowCommand(this.discussableViewModel));
	}
	
	private discussableModel: DiscussableModel;
	private discussableViewModel: DiscussableViewModel;
	
	private viewModelContext: ViewModelContext;
	private commentSynchronizer: CommentSynchronizer;
	private communicatorSubscriptions: Events.Subscription[] = [];
}