import Events = require('event')
import ContentCommunicator = require('contentcommunicator')
import KernaussageCommunicator = require('kernaussagecommunicator')
import DiscussionCommunicator = require('discussioncommunicator')
import KernaussageModel = require('kernaussagemodel')
import Comment = require('comment')

export interface Main extends DiscussionCommunicator.Base {
	content: ContentCommunicator.Main;
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