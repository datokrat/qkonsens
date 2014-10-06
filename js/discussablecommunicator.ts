import Events = require('event')
import Comment = require('comment')

export class Main {
	public commentsReceived: Events.Event<ReceivedArgs> = new Events.EventImpl<ReceivedArgs>();
	public queryCommentsOf(discussableId: number): void {
		throw new Error('not implemented');
	}
}

export interface ReceivedArgs {
	id: number;
	comments: Comment.Model[];
}