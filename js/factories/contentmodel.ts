import content = require('../contentmodel')

export class Factory {
	public create(text: string, title?: string): content.Model {
		var cnt = new content.Model();
		cnt.title(title);
		cnt.text(text);
		return cnt;
	}
}