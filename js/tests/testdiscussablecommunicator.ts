import Events = require('event')
import Obs = require('observable')
import Comment = require('comment')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import ContentCommunicator = require('../contentcommunicator')

import DiscussableCommunicator = require('discussablecommunicator')

class TestDiscussableCommunicator implements DiscussableCommunicator.Base {
	public content: ContentCommunicator.Main = new TestContentCommunicator();
	public commentsReceived = new Events.EventImpl<DiscussableCommunicator.ReceivedArgs>();
	
	public testItems: any = {};
	
	public queryCommentsOf(discussableId: number) {
		var item = this.testItems[discussableId];
		if(typeof item !== 'undefined')
			this.commentsReceived.raise({ id: discussableId, comments: item.comments.get() });
		else
			throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId not found');
	}
}

export = TestDiscussableCommunicator;