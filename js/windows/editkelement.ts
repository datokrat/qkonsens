import frame = require('../frame');
import Obs = require('../observable');
import Commands = require('../command');
import KElement = require('../kelement');
import KElementCommands = require('../kelementcommands');

export class Win extends frame.Win {
	constructor() {
		super('editkelement-win-template', null);
	}
	
	public title: Obs.Observable<string>;
	public text: Obs.Observable<string>;
	public context: Obs.Observable<string>;
	
	public submitGeneralContent: () => void;
}

export class Controller {
	constructor(private win: Win, private parentCommandProcessor: Commands.CommandProcessor) {
		this.win.title = ko.observable<string>();
		this.win.text = ko.observable<string>();
		this.win.context = ko.observable<string>();
		
		this.win.submitGeneralContent = () => {
			var cmd = new KElementCommands.UpdateGeneralContentCommand(this.kElement.general(), { then: () => {
				this.kElement.general().title(this.win.title());
				this.kElement.general().text(this.win.text());
			} });
			this.parentCommandProcessor.processCommand(cmd);
		};
	}
	
	public setModel(kElement: KElement.Model) {
		this.kElement = kElement;
		this.win.title(kElement.general().title());
		this.win.text(kElement.general().text());
	}
	
	private kElement: KElement.Model;
}