import frame = require('../frame');
import Obs = require('../observable');
import Commands = require('../command');
import KElement = require('../kelement');
import KElementCommands = require('../kelementcommands');
import ContentModel = require('../contentmodel');

export class Win extends frame.Win {
	constructor() {
		super('editkelement-win-template', null);
	}
	
	public title: Obs.Observable<string>;
	public text: Obs.Observable<string>;
	public context: Obs.Observable<string>;
	
	public submitGeneralContent: () => void;
	public submitContext: () => void;
}

export class Controller {
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
}