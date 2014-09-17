import Context = require('contextmodel')

export class Model {
	public title = ko.observable<string>();
	public text = ko.observable<string>();
	
	public set( content: Model ) {
		this.title( content.title() );
		this.text( content.text() );
	}
}

export class WithContext extends Model {
	public context = ko.observable<Context>( new Context );
	
	public set( content: Model ) {
		Model.prototype.set.call( this, content );
		
		if(content instanceof WithContext) {
			var withContext = <WithContext>content;
			this.context( withContext.context() );
		}
	}
}