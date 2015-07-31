import Events = require('event');
import ContentCommunicator = require('contentcommunicator');
import KernaussageCommunicator = require('kernaussagecommunicator');
import DiscussionCommunicator = require('discussioncommunicator');
import RatingCommunicator = require('ratingcommunicator');
import KonsenskisteModel = require('konsenskistemodel');
import KernaussageModel = require('kernaussagemodel');

export interface Main {
	content: ContentCommunicator.Main;
	kernaussage: KernaussageCommunicator.Main;
	discussion: DiscussionCommunicator.Base;
	rating: RatingCommunicator.Base;
	
	received: Events.Event<ReceivedArgs>;
	receiptError: Events.Event<ReceiptErrorArgs>;
	kernaussageAppended: Events.Event<KaAppendedArgs>;
	kernaussageAppendingError: Events.Event<KaAppendingErrorArgs>;
	query(id: number, out?: KonsenskisteModel.Model): KonsenskisteModel.Model;
	createAndAppendKa(kokiId: number, kaData: KernaussageData);
	create(koki: KonsenskisteData, parentTopicId: number, then: (id: number) => void);
}

export interface ContentData {
	title?: string; text: string;
}

export interface ContextData {
	context: string;
}

export interface KonsenskisteData extends ContentData {
}

export interface KernaussageData extends ContentData, ContextData {
}

export interface ReceivedArgs {
	id: number;
	konsenskiste: KonsenskisteModel.Model;
}

export interface ReceiptErrorArgs {
	id: number;
	message: string;
	konsenskiste: KonsenskisteModel.Model;
}

export interface KaAppendedArgs {
	konsenskisteId: number;
	kernaussageId: number;
	kernaussageData: KernaussageData;
}

export interface KaAppendingErrorArgs {
	konsenskisteId: number;
	message: string;
}