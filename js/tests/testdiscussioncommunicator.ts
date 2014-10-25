import Events = require('../event')
import Obs = require('../observable')
import ItemContainer = require('../itemcontainer')
import Comment = require('../comment')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import ContentCommunicator = require('../contentcommunicator')

import Discussion = require('../discussion')
import DiscussableCommunicator = require('../discussioncommunicator')

class TestDiscussableCommunicator implements DiscussableCommunicator.Base {
	public content: ContentCommunicator.Main = new TestContentCommunicator();
	public commentsReceived = new Events.EventImpl<DiscussableCommunicator.ReceivedArgs>();
	public commentsReceiptError = new Events.EventImpl<DiscussableCommunicator.CommentsReceiptErrorArgs>();
	
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
	
	public setTestDiscussable(discussable: Discussion.DiscussableModel) {
		this.internalItemContainer.set(discussable.id(), discussable);
	}
}

export = TestDiscussableCommunicator;