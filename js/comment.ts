import Obs = require('observable')
import KSync = require('synchronizers/ksynchronizers')
import ContentModel = require('contentmodel')
import ContentViewModel = require('contentviewmodel')
import ContentController = require('contentcontroller')
import ContentCommunicator = require('contentcommunicator')
import DiscussionCommunicator = require('discussioncommunicator');
import Rating = require('rating');
import Commands = require('command');

export interface CommentableModel {
	comments: Obs.ObservableArrayEx<Model>;
	removeComment: (comment: Model) => void;
}

export class Model {
	public id: number;
	public content: Obs.Observable<ContentModel.General> = ko.observable( new ContentModel.General );
	public rating: Obs.Observable<Rating.LikeRatingModel> = ko.observable(new Rating.LikeRatingModel);
	public author: Obs.Observable<string> = ko.observable<string>();
}

var idCtr = 0;
export class ViewModel {
	public id = idCtr++;
	public content: Obs.Observable<ContentViewModel.General>;
	public rating: Obs.Observable<Rating.LikeRatingViewModel>;
	public author: Obs.Observable<string>;
	
	public removeClick: () => void;
}

export class Controller {
	constructor(private model: Model, viewModel: ViewModel, private communicator: DiscussionCommunicator.Base) {
		this.initCommandProcessor();
		
		viewModel.author = model.author;
		viewModel.content = ko.observable<ContentViewModel.General>();
		viewModel.removeClick = () => {
			this.commentableModel && this.commentableModel.removeComment(model);
		};
	
		this.contentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content)
			.setViewModelObservable(viewModel.content)
			.setModelObservable(model.content);
		
		viewModel.rating = ko.observable<Rating.LikeRatingViewModel>();
		this.ratingSynchronizer = new KSync.LikeRatingSynchronizer(this.commandProcessor);
		this.ratingSynchronizer
			.setViewModelObservable(viewModel.rating)
			.setModelObservable(model.rating);
	}
	
	public initCommandProcessor() {
		this.commandProcessor.chain.append(cmd => {
			if(cmd instanceof Rating.SelectLikeRatingCommand) {
				var typedCmd = <Rating.SelectLikeRatingCommand>cmd;
				this.communicator.rating.submitLikeRating(this.model.id, typedCmd.ratingValue, typedCmd.then);
				return true;
			}
			return false;
		});
	}
	
	public setCommentableModel(commentableModel: CommentableModel) {
		this.commentableModel = commentableModel;
	}
	
	public dispose() {
		this.contentSynchronizer.dispose();
		this.ratingSynchronizer.dispose();
	}
	
	public commandProcessor = new Commands.CommandProcessor();
	
	private contentSynchronizer: KSync.GeneralContentSynchronizer;
	private ratingSynchronizer: KSync.LikeRatingSynchronizer;
	private commentableModel: CommentableModel;
}