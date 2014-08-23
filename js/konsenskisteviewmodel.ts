import observable = require('observable')

import Content = require('contentviewmodel')
import Kernaussage = require('kernaussageviewmodel')

export class ViewModel {
	public content: observable.Observable<Content.WithContext>;

	public childKas: () => Kernaussage.ViewModel[]; //TODO: Make observable
}