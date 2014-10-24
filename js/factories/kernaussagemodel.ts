import ka = require('../kernaussagemodel')

export class Factory {
	public create(text: string, title?: string): ka.Model {
		var kernaussage = new ka.Model();
		kernaussage.general().text(text);
		kernaussage.general().title(title);
		return kernaussage;
	}
}