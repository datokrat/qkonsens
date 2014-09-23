import ContentModel = require('../contentmodel')

class Factory {
	public createGeneralContent(text: string, title?: string, out?: ContentModel.General): ContentModel.General {
		var cnt = out || new ContentModel.General();
		cnt.title(title);
		cnt.text(text);
		return cnt;
	}
	
	public createContext(text: string): ContentModel.Context {
		var cxt = new ContentModel.Context();
		cxt.text(text);
		return cxt;
	}
}

export = Factory;