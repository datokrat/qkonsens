import koki = require('../konsenskistemodel')
import EventFactory = require('./event')

export class Factory {
	public create(title: string, text?: string, id?: number): koki.Model {
		var konsenskiste = new koki.Model({ eventFactory: this.eventFactory });
		id && konsenskiste.id(id);
		text && konsenskiste.general().text(text);
		konsenskiste.general().title(title);
		return konsenskiste;
	}
	
	public setEventFactory(value: EventFactory.Factory): Factory {
		this.eventFactory = value;
		return this;
	}
	
	private eventFactory: EventFactory.Factory;
}