import koki = require('../konsenskistemodel')

export class Factory {
	public create(title: string): koki.Model {
		var konsenskiste = new koki.Model();
		konsenskiste.title(title);
		return konsenskiste;
	}
}