import Events = require('event')
import ContentCommunicator = require('contentcommunicator')
import KonsenskisteModel = require('konsenskistemodel')
import Comment = require('comment')

export interface Main {
	content: ContentCommunicator.Main;
	received: Events.Event<ReceivedArgs>;
	commentsReceived: Events.Event<CommentsReceivedArgs>;
	
	queryKoki(id: number);
	queryComments(id: number);
}

export interface ReceivedArgs {
	id: number;
	konsenskiste: KonsenskisteModel.Model;
}

export interface CommentsReceivedArgs {
	id: number;
	comments: Comment.Model[];
}