import content = require('../contentmodel')

export class Factory {
	public create(text: string, title?: string, out?: content.Model): content.Model {
		var cnt = out || new content.Model();
		cnt.title(title);
		cnt.text(text);
		return cnt;
	}
	
	public createWithContext(text: string, title?: string, context?: string): content.WithContext {
		var cnt = new content.WithContext();
		this.create( text, title, cnt );
		
		cnt.context(context);
		return cnt;
	}
}