import content = require('contentviewmodel')
import ka = require('kernaussageviewmodel')

export class ViewModel {
	public content = new content.ViewModel();

	public childKas: () => ka.ViewModel[];
}