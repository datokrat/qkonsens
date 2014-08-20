///reference path='./typings/knockout.d.ts' />
declare var $;


export class Coll {
	public static single(collection: any[], predicate: (item: any, index: number) => boolean ): any  {
		for(var i = 0; i < collection.length; ++i) {
			if(predicate(collection[i], i))
				return collection[i];
		}
		return undefined;
	}
	
	public static has<T>(collection: T[], predicate: (item: T, index: number) => boolean ): boolean {
		return Coll.single(collection, predicate);
	}
	
	public static where(collection: any[], predicate: (item: any, index: number) => boolean ): any[]  {
		var ret = [];
		for(var i = 0; i < collection.length; ++i) {
			if(predicate(collection[i], i))
				ret.push(collection[i]);
		}
		return ret;
	}
	
	public static count(collection: any[], predicate: (item: any, index: number) => boolean ): number {
		return Coll.where(collection, predicate).length;
	}
	
	public static koRemoveWhere(collection: any, predicate: (item: any, index: number) => boolean ): any[] {
		var where = Coll.where(collection(), predicate);
		if(where.length > 0)
			collection.removeAll(where);
		return where;
	}
}

export class Comp {
	public static jsonEq(x: any, y: any): boolean {
		return JSON.stringify(x) == JSON.stringify(y);
	}
	
	public static genericEq(x: any, y: any): boolean {
		return x.eq(y);
	}
}

export class Callbacks {
	public static atOnce(callbacks: any[], onSuccess?: () => void) {
		var ctr = callbacks.length;
		
		var onReady = () => {
			--ctr;
			if(ctr <= 0) onSuccess && onSuccess();
		};
		for(var i = 0; i < callbacks.length; ++i) callbacks[i](onReady);
	}
	
	public static batch(callbacks: any[], onSuccess?: () => void) {
		var func = (i: number) => {
			if(i >= callbacks.length) onSuccess();
			else if(i >= callbacks.length-1) callbacks[i](onSuccess);
			else callbacks[i](func.bind(null, i+1));
		};
		func(0);
	}
}

ko.observable.fn.mapValue = function(map: (any) => any) { this(map(this())) };