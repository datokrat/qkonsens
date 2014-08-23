import Model = require('contextmodel')
import ViewModel = require('contextviewmodel')

class Controller {
	constructor( model: Model, viewModel: ViewModel ) {
		this.viewModel = viewModel;
		
		this.viewModel.text = ko.computed( () => model.text() );
		this.viewModel.isVisible = ko.observable<boolean>(false);
	}
	
	public dispose() {
		this.viewModel.text.dispose();
	}
	
	private viewModel: ViewModel;
}

export = Controller;