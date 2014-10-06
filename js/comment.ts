import Obs = require('observable')
import KSync = require('synchronizers/ksynchronizers')
import ContentModel = require('contentmodel')
import ContentViewModel = require('contentviewmodel')
import ContentController = require('contentcontroller')
import ContentCommunicator = require('contentcommunicator')

export class Model {
	public id: number;
	public content: Obs.Observable<ContentModel.General> = ko.observable( new ContentModel.General );
}

var idCtr = 0;
export class ViewModel {
	public id = idCtr++;
	public content: Obs.Observable<ContentViewModel.General>;
}

export class Controller {
	constructor(model: Model, viewModel: ViewModel, communicator: ContentCommunicator.Main) {
		viewModel.content = ko.observable<ContentViewModel.General>();
	
		this.contentSynchronizer = new KSync.GeneralContentSynchronizer(communicator)
			.setViewModelChangedHandler( content => viewModel.content(content) )
			.setModelObservable(model.content);
	}
	
	public dispose() {
		this.contentSynchronizer.dispose();
	}
	
	private contentSynchronizer: KSync.GeneralContentSynchronizer;
}