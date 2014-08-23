import unit = require('tests/tsunit')
import test = require('tests/test')

import webot = require('frontendtests/webot')

export class Tests {
	private webot = new webot.Webot;

	testTitle() {
		test.assert( () => this.webot.query('h1').text('Konsenskiste').exists() );
	}

	testDocumentView() {
		this.webot.query('*').text('wechseln').click();
		
		test.assert( () => this.webot.query('*').text('Dokumentansicht').exists() );
		test.assert( () => this.webot.query('*').text('Detailansicht').exists(false) );
		
		this.webot.queryContains('a', 'wechseln').click();
		
		test.assert( () => this.webot.query('*').text('Detailansicht').exists() );
		test.assert( () => this.webot.query('*').text('Dokumentansicht').exists(false) );
	}
	
	testKokiContent() {
		test.assert( () => this.webot.query('h1').text('Konsenskisten-Titel').exists() );
		test.assert( () => this.webot.query('*').text('Lorem ipsum dolor sit amet').exists() );
	}
	
	testKaContent() {
		test.assert( () => this.webot.query('h1').text('Kernaussagen-Titel').exists() );
		test.assert( () => this.webot.query('*').text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.').exists() );
	}
}