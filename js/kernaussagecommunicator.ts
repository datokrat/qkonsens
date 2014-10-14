import Events = require('event')
import ContentCommunicator = require('contentcommunicator')
import KernaussageCommunicator = require('kernaussagecommunicator')
import DiscussionCommunicator = require('discussioncommunicator')
import RatingCommunicator = require('ratingcommunicator');
import KernaussageModel = require('kernaussagemodel')
import Comment = require('comment');

export interface Main {
	content: ContentCommunicator.Main;
	discussion: DiscussionCommunicator.Base;
	rating: RatingCommunicator.Base;
	received: Events.Event<ReceivedArgs>;
	
	query(id: number);
}

export interface ReceivedArgs {
	konsenskiste: KernaussageModel.Model;
}

export interface CommentsReceivedArgs {
	id: number;
	comments: Comment.Model[];
}