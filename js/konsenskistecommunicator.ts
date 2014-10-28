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
	kernaussageAppended: Events.Event<KaAppendedArgs>;
	kernaussageAppendingError: Events.Event<KaAppendingErrorArgs>;
	queryKoki(id: number): KonsenskisteModel.Model;
	createAndAppendKa(kokiId: number, ka: KernaussageModel.Model);
}

export interface ReceivedArgs {
	id: number;
	konsenskiste: KonsenskisteModel.Model;
}

export interface KaAppendedArgs {
	konsenskisteId: number;
	kernaussage: KernaussageModel.Model;
}

export interface KaAppendingErrorArgs {
	konsenskisteId: number;
	message: string;
}