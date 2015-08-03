import frame = require('../frame');
import Obs = require('../observable');
import Commands = require('../command');
import KElement = require('../kelement');
import KElementCommands = require('../kelementcommands');
import ContentModel = require('../contentmodel');

export class Main {
	public data: Data;
	public frame: Win;
	public model: Model;
	
	public static CreateEmpty(commandProcessor: Commands.CommandProcessor) {
		var ret = new Main;
		ret.data = new Data;
		ret.model = new Model(ret.data, commandProcessor);
		ret.frame = new Win(ret.model, ret.data);
		return ret;
	}
	
	public dispose() {
		this.model.dispose();
	}
}

export class Win extends frame.Win {
	constructor(private model: Model, data: Data) {
		super('editkelement-win-template', null);
		this.title = data.title;
		this.text = data.text;
		this.context = data.context;
	}
	
	public title: Obs.Observable<string>;
	public text: Obs.Observable<string>;
	public context: Obs.Observable<string>;
	
	public submitGeneralContent = () => this.model.submitGeneralContent();
	public submitContext = () => this.model.submitContext();
}

export class Model {
	constructor(private data: Data, private commandProcessor: Commands.CommandProcessor) {
	}
	
	public setKElementModel(kElement: KElement.Model) {
		this.kElement = kElement;
		
		this.data.title(kElement.general().title());
		this.data.text(kElement.general().text());
		this.data.context(kElement.context().text());
	}
	
	public submitGeneralContent() {
			var newContent = new ContentModel.General();
			newContent.set(this.kElement.general());
			newContent.title(this.data.title());
			newContent.text(this.data.text());
			
			var cmd = new KElementCommands.UpdateGeneralContentCommand(newContent, { then: () => {
				this.kElement.general().title(this.data.title());
				this.kElement.general().text(this.data.text());
			} });
			this.commandProcessor.processCommand(cmd);
	}
	
	public submitContext() {
			var newContext = new ContentModel.Context();
			newContext.set(this.kElement.context());
			newContext.text(this.data.context());
			
			var cmd = new KElementCommands.UpdateContextCommand(newContext, { then: () => {
				this.kElement.context().text(this.data.context()); //Is it possible to generalize this procedure of updating?
			} });
			this.commandProcessor.processCommand(cmd);
	}
	
	public dispose() {
	}
	
	private kElement;
}

export class Data {
	public title = ko.observable<string>();
	public text = ko.observable<string>();
	public context = ko.observable<string>();
}

/*export class Controller {
	constructor(private win: Win, private parentCommandProcessor: Commands.CommandProcessor) {
		this.win.title = ko.observable<string>();
		this.win.text = ko.observable<string>();
		this.win.context = ko.observable<string>();
		
		this.win.submitGeneralContent = () => {
			var newContent = new ContentModel.General();
			newContent.set(this.kElement.general());
			newContent.title(this.win.title());
			newContent.text(this.win.text());
			
			var cmd = new KElementCommands.UpdateGeneralContentCommand(newContent, { then: () => {
				this.kElement.general().title(this.win.title());
				this.kElement.general().text(this.win.text());
			} });
			this.parentCommandProcessor.processCommand(cmd);
		};
		
		this.win.submitContext = () => {
			var newContext = new ContentModel.Context();
			newContext.set(this.kElement.context());
			newContext.text(this.win.context());
			
			var cmd = new KElementCommands.UpdateContextCommand(newContext, { then: () => {
				this.kElement.context().text(this.win.context());
			} });
			this.parentCommandProcessor.processCommand(cmd);
		};
	}
	
	public setModel(kElement: KElement.Model) {
		this.kElement = kElement;
		this.win.title(kElement.general().title());
		this.win.text(kElement.general().text());
		this.win.context(kElement.context().text());
	}
	
	private kElement: KElement.Model;
}*/