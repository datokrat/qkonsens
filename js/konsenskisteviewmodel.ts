import observable = require('observable')

import Content = require('contentviewmodel')
import Kernaussage = require('kernaussageviewmodel')

export class ViewModel {
	public general: observable.Observable<Content.General>;
	public context: observable.Observable<Content.Context>;

	public childKas: () => Kernaussage.ViewModel[]; //TODO: Make observable
}