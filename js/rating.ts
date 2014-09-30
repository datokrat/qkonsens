import Obs = require('observable')

export class Model {
	public personalRating: Obs.Observable<string> = ko.observable<string>('none');
}

export class ViewModel {
	public personalRating: Obs.Observable<string>;
}

export class Controller {
	constructor(model: Model, viewModel: ViewModel) {
		viewModel.personalRating = model.personalRating;
	}
}