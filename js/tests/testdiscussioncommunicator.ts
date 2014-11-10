import Events = require('../event')
import Obs = require('../observable')
import Id = require('../id');
import Common = require('../common');
import ItemContainer = require('../itemcontainer')
import Comment = require('../comment')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import ContentCommunicator = require('../contentcommunicator')

import Discussion = require('../discussion')
import DiscussionCommunicator = require('../discussioncommunicator')

class TestDiscussableCommunicator implements DiscussionCommunicator.Base {
	public content: ContentCommunicator.Main = new TestContentCommunicator();
	public commentsReceived = new Events.EventImpl<DiscussionCommunicator.ReceivedArgs>();
	public commentsReceiptError = new Events.EventImpl<DiscussionCommunicator.CommentsReceiptErrorArgs>();
	public commentAppended: Events.Event<DiscussionCommunicator.AppendedArgs> = new Events.EventImpl<DiscussionCommunicator.AppendedArgs>();
	public commentAppendingError: Events.Event<DiscussionCommunicator.AppendingErrorArgs> = new Events.EventImpl<DiscussionCommunicator.AppendingErrorArgs>();
	public commentRemoved = new Events.EventImpl<DiscussionCommunicator.RemovedArgs>();
	public commentRemovalError = new Events.EventImpl<DiscussionCommunicator.RemovalErrorArgs>();
	
	private testItemContainers: ItemContainer.Many<Discussion.DiscussableModel>;
	private internalItemContainer: ItemContainer.Base<Discussion.DiscussableModel>;
	
	constructor() {
		this.testItemContainers = new ItemContainer.Many<Discussion.DiscussableModel>();
		this.testItemContainers.insertContainer(
			this.internalItemContainer = new ItemContainer.Main<Discussion.DiscussableModel>()
		);
	}
	
	public insertTestItemContainer(container: ItemContainer.Readonly<Discussion.DiscussableModel>) {
		this.testItemContainers.insertContainer(container);
	}
	
	public removeTestItemContainer(container: ItemContainer.Readonly<Discussion.DiscussableModel>) {
		this.testItemContainers.removeContainer(container);
	}
	
	public queryCommentsOf(discussableId: number) {
		try {
			var item: Discussion.DiscussableModel = this.testItemContainers.get(discussableId);
		}
		catch(e) {
			this.commentsReceiptError.raise({ discussableId: discussableId, message: 'discussableId[' + discussableId + '] not found' });
			//throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId[' + discussableId + '] not found');
			return;
		}
		this.commentsReceived.raise({ id: discussableId, comments: item.discussion().comments.get() });
	}
	
	public appendComment(discussableId: number, comment: Comment.Model) {
		this.testItemContainers.get(discussableId).discussion().comments.push(comment);
		this.commentAppended.raise({ discussableId: discussableId, comment: comment });
	}
	
	public removeComment(args: DiscussionCommunicator.RemovalArgs) {
		Common.Coll.removeOneByPredicate(this.testItemContainers.get(args.discussableId).discussion().comments.get(), 
			comment => comment.id == args.commentId); //TODO: Should comparison be based on ReferenceId instead?
		this.commentRemoved.raise({ discussableId: args.discussableId, commentId: args.commentId });
	}
	
	public setTestDiscussable(discussable: Discussion.DiscussableModel) {
		this.internalItemContainer.set(discussable.id(), discussable);
	}
}

export = TestDiscussableCommunicator;