import Content = require('contentviewmodel')

export class ViewModel {
	public content = new Content.ViewModel();
	public isActive: () => boolean;
}