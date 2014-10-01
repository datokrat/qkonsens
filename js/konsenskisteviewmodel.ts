import observable = require('observable')

import Content = require('contentviewmodel')
import Kernaussage = require('kernaussageviewmodel')
import Rating = require('rating')

export class ViewModel {
	public general: observable.Observable<Content.General>;
	public context: observable.Observable<Content.Context>;
	public rating: observable.Observable<Rating.ViewModel>;

	public childKas: () => Kernaussage.ViewModel[]; //TODO: Make observable
}