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
		
		konsenskiste.childKas.push(kernaussage);
		
		test.assert(() => konsenskiste.childKas.get()[0] == kernaussage);
	}
	
	testRemoveKa() {
		var konsenskiste = this.factory.create( 'Basisdemokratie' );
		var kernaussage = this.kaFactory.create( 'Begriff Basisdemokratie' );
		
		konsenskiste.childKas.push(kernaussage);
		konsenskiste.childKas.remove(kernaussage);
		
		test.assert(() => konsenskiste.childKas.get().length == 0);
	}
	
	testRemoveKa2() {
		var konsenskiste = this.factory.create( 'Basisdemokratie' );
		
		konsenskiste.childKas.push( this.kaFactory.create( 'Begriff Basisdemokratie' ) );
		konsenskiste.childKas.remove( this.kaFactory.create( 'Begriff Basisdemokratie' ) );
		
		test.assert(() => konsenskiste.childKas.get().length == 1);
	}
	
	testKaEvents() {
		var konsenskiste = this.factory.create( 'Basisdemokratie' );
		var kernaussage = this.kaFactory.create( 'Begriff Basisdemokratie' );
		
		var insertionCtr = 0;
		var insertionListener = ka => {
			test.assert(() => ka == kernaussage);
			++insertionCtr;
		};
		
		var removalCtr = 0;
		var removalListener = ka => {
			test.assert(() => ka == kernaussage);
			++removalCtr;
		};
		
		konsenskiste.childKas.pushed.subscribe(insertionListener);
		konsenskiste.childKas.removed.subscribe(removalListener);
		
		konsenskiste.childKas.push(kernaussage);
		test.assert(() => konsenskiste.childKas.get().length == 1);
		test.assert(() => konsenskiste.childKas.get()[0] == kernaussage);
		test.assert(() => insertionCtr == 1);
		test.assert(() => removalCtr == 0);
		
		konsenskiste.childKas.remove(kernaussage);
		test.assert(() => konsenskiste.childKas.get().length == 0);
		test.assert(() => insertionCtr == 1);
		test.assert(() => removalCtr == 1);
		
	}
}

class KonsenskisteFactory {
	public create(title: string, text?: string) {
		var konsenskiste = new koki.Model();
		konsenskiste.general().title(title);
		konsenskiste.general().text(text);
		return konsenskiste;
	}
}

class KernaussageFactory {
	public create(title: string) {
		var kernaussage = new ka.Model();
		kernaussage.general().title(title);
		return kernaussage;
	}
}