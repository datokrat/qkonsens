import ka = require('../kernaussagemodel')

export class Factory {
	public create(title: string): ka.Model {
		var kernaussage = new ka.Model();
		kernaussage.title(title);
		return kernaussage;
	}
}