import observable = require('../observable')
import frame = require('../frame')

import koki = require('../konsenskisteviewmodel')

export class Win extends frame.Win {
	constructor() {
		super('kk-win-template', null);
	}
	
	public documentView = ko.observable(false);
	public kkView: observable.Observable<koki.ViewModel>;
}