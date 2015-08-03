import frame = require('../frame');
import Obs = require('../observable');
import Commands = require('../command');
import Topic = require('../topic');
import MainController = require('../controller');
import KokiLogic = require('../kokilogic');
import KonsenskisteModel = require('../konsenskistemodel');

export class Main {
	public frame: Win;
	public model: Model;
	
	public static CreateEmpty(commandProcessor: Commands.CommandProcessor) {
		var ret = new Main;
		ret.model = new Model(commandProcessor);
		ret.frame = new Win(ret.model);
		return ret;
	}
	
	public dispose() {
		this.model.dispose();
	}
}

export class Win extends frame.Win {
	constructor(private model: Model) {
		super('newkk-win-template', null);
		this.state('ok');
		
		this.parentName = this.model.getParentNameObservable();
		this.title = this.model.getKokiData().title;
		this.text = this.model.getKokiData().text;
	}
	
	public parentName: Obs.Observable<string>;
	public title: Obs.Observable<string>;
	public text: Obs.Observable<string>;
	public clickSubmit = () => {
		this.model.onClickSubmit();
	};
}

export class Model {
	constructor(private commandProcessor: Commands.CommandProcessor) {
		this.parentName = ko.computed<string>(() => this.parentTopic() && (this.parentTopic().title() || this.parentTopic().text()));
	}
	
	public onClickSubmit() {
		this.commandProcessor.processCommand(new MainController.CreateNewKokiCommand(
			{ title: this.kokiData.title(), text: this.kokiData.text() }, 
			this.parentTopic().id, 
			id => this.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(id))
		));
	}
	
	public getKokiData() {
		return this.kokiData;
	}
	
	public getParentNameObservable() {
		return this.parentName;
	}
	
	public setParentTopic(parentTopic: Topic.Model) {
		this.parentTopic(parentTopic);
		this.kokiData.clear();
	}
	
	public dispose() {
		this.parentName.dispose();
	}
	
	private kokiData: KonsenskisteData = new KonsenskisteData();
	private parentTopic = ko.observable<Topic.Model>();
	private parentName: KnockoutComputed<string>;
}

export class KonsenskisteData {
	public title = ko.observable<string>();
	public text = ko.observable<string>();
	
	constructor(title: string = "", text: string = "") {
		this.title(title);
		this.text(text);
	}
	
	public set(other: KonsenskisteData): KonsenskisteData {
		this.title(other.title());
		this.text(other.text());
		return this;
	}
	
	public clear() {
		this.title(''); this.text('');
	}
}