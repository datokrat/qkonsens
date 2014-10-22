function initFrame() {
	var frame = top.frames[2];
	
	frame.$.fn.simulateClick = function() {
	    return this.each(function() {
	        if('createEvent' in document) {
	            var doc = this.ownerDocument,
	                evt = doc.createEvent('MouseEvents');
	            evt.initMouseEvent('click', true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	            this.dispatchEvent(evt);
	        } else {
	            this.click(); // IE
	        }
	    });
	}
	
	frame.$.fn.simulateMouseEvent = function(eventName) {
	    return this.each(function() {
	        if('createEvent' in document) {
	            var doc = this.ownerDocument,
	                evt = doc.createEvent('MouseEvents');
	            evt.initMouseEvent(eventName, true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	            this.dispatchEvent(evt);
	        } else {
	            this.click(); // IE
	        }
	    });
	}
	
	return frame;
}

export class Webot {
	public constructor() {
		this.frame = initFrame();
	}

	public query(q: string) {
		return new WebotElement(this.frame, q);
	}
	
	public queryContains(q: string, text: string) {
		return this.query( q + ':contains("' + text + '")' );
	}
	
	private frame;
}

export class WebotElement {
	private frame;

	constructor(frame, q: any) {
		this.frame = frame;
		if(typeof q == 'string')
			this.el = frame.$(<string>q);
		else
			this.el = q;
		
	}
	
	public click() {
		this.el['simulateClick']();
	}
	
	public length() {
		return this.el.length;
	}
	
	public filter(predicate: () => boolean) {
		return new WebotElement( this.frame, this.el.filter(predicate) );
	}
	
	public contains(text: string) {
		var _this = this;
		return this.filter(function() {
			return _this.frame.$(this).text().indexOf(text) != -1
		});
	}
	
	public text(text: string) {
		var _this = this;
		return this.filter(function() {
			return _this.frame.$(this).clone().children().remove().end().text().trim() == text.trim();
		});
	}
	
	public child(q: string) {
		return new WebotElement(this.frame, this.frame.$(q, this.el));
	}
	
	public exists(expectation?: boolean): boolean {
		return this.length() == (expectation != false ? 1 : 0) ;
	}
	
	public existMany(): boolean {
		return this.length() != 0;
	}
	
	public $(): JQuery {
		return this.el;
	}
	
	private el: JQuery;
}