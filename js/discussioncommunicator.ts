import Events = require('event')
import Common = require('common');
import Comment = require('comment')
import ContentCommunicator = require('contentcommunicator')
import RatingCommunicator = require('ratingcommunicator');

export interface Base {
	content: ContentCommunicator.Main;
	rating: RatingCommunicator.Base;

	commentsReceived: Events.Event<ReceivedArgs>;
	commentsReceiptError: Events.Event<CommentsReceiptErrorArgs>;
	queryCommentsOf(discussableId: number, err?: (error) => void): void;
	
	commentAppended: Events.Event<AppendedArgs>;
	commentAppendingError: Events.Event<AppendingErrorArgs>;
	appendComment(discussableId: number, comment: Comment.Model): void;
	
	commentRemoved: Events.Event<RemovedArgs>;
	commentRemovalError: Events.Event<RemovalErrorArgs>;
	removeComment(args: RemovalArgs);
}

export interface ReceivedArgs {
	id: number;
	comments: Comment.Model[];
}

export interface CommentsReceiptErrorArgs {
	discussableId: number;
	message: string;
}

export interface AppendedArgs {
	discussableId: number;
	comment: Comment.Model;
}

export interface AppendingErrorArgs {
	discussableId: number;
	comment: Comment.Model;
	error: any;
}

export interface RemovedArgs {
	discussableId: number;
	commentId: number;
}

export interface RemovalErrorArgs {
	discussableId: number;
	commentId: number;
	error: any;
}

export interface RemovalArgs {
	discussableId: number;
	commentId: number;
}