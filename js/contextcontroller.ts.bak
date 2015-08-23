import Events = require('event')
import Model = require('contextmodel')
import ViewModel = require('contextviewmodel')

class Controller {
	constructor( model: Model, viewModel: ViewModel ) {
		this.viewModel = viewModel;
		
		this.viewModel.text = ko.computed( () => model.text() );
		this.viewModel.isVisible = ko.observable<boolean>(false);
		
		this.viewModel.toggleVisibility = new Events.EventImpl<Events.Void>();
		this.viewModel.toggleVisibility.subscribe( () => this.toggleVisibility() );
	}
	
	private toggleVisibility() {
		var isVisible = this.viewModel.isVisible();
		this.viewModel.isVisible( !isVisible );
	}
	
	public dispose() {
		this.viewModel.text.dispose();
	}
	
	private viewModel: ViewModel;
}

export = Controller;