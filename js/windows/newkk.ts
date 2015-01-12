import frame = require('../frame');
import Obs = require('../observable');
import Commands = require('../command');
import Topic = require('../topic');
import MainController = require('../controller');
import KokiLogic = require('../kokilogic');
import KonsenskisteModel = require('../konsenskistemodel');

export class Win extends frame.Win {
	constructor() {
		super('newkk-win-template', null);
		this.state('ok');
	}
	
	public parentName: Obs.Observable<string>;
	public title: Obs.Observable<string>;
	public text: Obs.Observable<string>;
	public clickSubmit: () => void;
}

export class Controller {
	constructor(private window: Win, commandProcessor: Commands.CommandProcessor) {
		window.parentName = ko.computed<string>(() => this.parentTopic() && (this.parentTopic().title() || this.parentTopic().text()));
		window.title = ko.observable<string>();
		window.text = ko.observable<string>();
		
		window.clickSubmit = () => {
			var koki = new KonsenskisteModel.Model();
			koki.general().title(window.title());
			koki.general().text(window.text());
			commandProcessor.processCommand(new MainController.CreateNewKokiCommand(koki, this.parentTopic(), id => {
				koki.id(id);
				commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(koki));
			}));
		};
	}
	
	public setParentTopic(parentTopic: Topic.Model) {
		this.parentTopic(parentTopic);
		this.window.title(null);
		this.window.text(null);
	}
	
	public dispose() {
		this.window.parentName.dispose();
	}
	
	private parentTopic = ko.observable<Topic.Model>();
}