import unit = require('tests/tsunit')
import test = require('tests/test')

import koki = require('../konsenskistemodel')
import ka = require('../kernaussagemodel')

export class Tests extends unit.TestClass {
	private factory = new KonsenskisteFactory();
	private kaFactory = new KernaussageFactory();

	testChildKaArray() {
		var konsenskiste = this.factory.create( 'Basisdemokratie (Konzept)' );
		var kernaussage = this.kaFactory.create( 'Begriff Basisdemokratie' );
		
		konsenskiste.appendKa(kernaussage);
		
		test.assert(() => konsenskiste.getChildKaArray()[0] == kernaussage);
	}
	
	testRemoveKa() {
		var konsenskiste = this.factory.create( 'Basisdemokratie' );
		var kernaussage = this.kaFactory.create( 'Begriff Basisdemokratie' );
		
		konsenskiste.appendKa(kernaussage);
		konsenskiste.removeKa(kernaussage);
		
		test.assert(() => konsenskiste.getChildKaArray().length == 0);
	}
	
	testRemoveKa2() {
		var konsenskiste = this.factory.create( 'Basisdemokratie' );
		
		konsenskiste.appendKa( this.kaFactory.create( 'Begriff Basisdemokratie' ) );
		konsenskiste.removeKa( this.kaFactory.create( 'Begriff Basisdemokratie' ) );
		
		test.assert(() => konsenskiste.getChildKaArray().length == 1);
	}
	
	testKaEvents() {
		var konsenskiste = this.factory.create( 'Basisdemokratie' );
		var kernaussage = this.kaFactory.create( 'Begriff Basisdemokratie' );
		
		var insertionCtr = 0;
		var insertionListener = args => {
			test.assert(() => args.childKa == kernaussage);
			++insertionCtr;
		};
		
		var removalCtr = 0;
		var removalListener = args => {
			test.assert(() => args.childKa == kernaussage);
			++removalCtr;
		};
		
		konsenskiste.childKaInserted.subscribe(insertionListener);
		konsenskiste.childKaRemoved.subscribe(removalListener);
		
		konsenskiste.appendKa(kernaussage);
		test.assert(() => insertionCtr == 1);
		test.assert(() => removalCtr == 0);
		
		konsenskiste.removeKa(kernaussage);
		test.assert(() => insertionCtr == 1);
		test.assert(() => removalCtr == 1);
	}
}

class KonsenskisteFactory {
	public create(title: string, text?: string) {
		var konsenskiste = new koki.Model();
		konsenskiste.content.title(title);
		konsenskiste.content.text(text);
		return konsenskiste;
	}
}

class KernaussageFactory {
	public create(title: string) {
		var kernaussage = new ka.Model();
		kernaussage.content.title(title);
		return kernaussage;
	}
}