import observable = require('observable')

import mdl = require('contentmodel')
import vm = require('contentviewmodel')

import ContextViewModel = require('contextviewmodel')
import ContextModel = require('contextmodel')
import ContextController = require('contextcontroller')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		this.init(model, viewModel);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel) {
		this.viewModel = viewModel;
		this.model = model;
		
		this.viewModel.title = ko.computed( () => model.title() );
		this.viewModel.text = ko.computed( () => model.text() );
	}
	
	public dispose() {
		this.viewModel.title.dispose();
		this.viewModel.text.dispose();
	}
	
	private viewModel: vm.ViewModel;
	private model: mdl.Model;
}

export class WithContext extends Controller {
	constructor(model: mdl.WithContext, viewModel: vm.WithContext) {
		super(model, viewModel);
		this.initContext(model, viewModel);
	}
	
	private initContext(model: mdl.WithContext, viewModel: vm.WithContext) {
		this.viewModelWithContext = viewModel;
		this.modelWithContext = model;
		
		this.viewModelWithContext.context = ko.observable<ContextViewModel>( new ContextViewModel );
		
		var contextModel = this.modelWithContext.context();
		var contextViewModel = this.viewModelWithContext.context();
		var contextController = new ContextController( contextModel, contextViewModel );
		
		this.context = contextController;
	}
	
	public dispose() {
		Controller.prototype.dispose.apply(this, arguments);
		
		this.context.dispose();
	}
	
	private viewModelWithContext: vm.WithContext;
	private modelWithContext: mdl.WithContext;
	
	private context: ContextController;
}