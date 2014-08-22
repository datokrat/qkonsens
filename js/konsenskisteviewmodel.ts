import observable = require('observable')

import content = require('contentviewmodel')
import ka = require('kernaussageviewmodel')

export class ViewModel {
	public content: observable.Observable<content.ViewModel>;

	public childKas: () => ka.ViewModel[];
}