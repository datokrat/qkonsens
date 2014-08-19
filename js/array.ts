interface Array<T> {
	removeOne(element: T): boolean;
	removeOneByPredicate(predicate: (T) => boolean): boolean;
	where(predicate: (T, index: number) => boolean): Array<T>;
	first(predicate: (T) => boolean): T;
	
	get(index: number): T;
}

Array.prototype.removeOne = function(el) {
	var index = this.indexOf(el);
	if(index != -1) {
		this.splice(index, 1);
		return true;
	}
}

Array.prototype.removeOneByPredicate = function(pr) {
	var index = this.indexOf(this.first(pr));
	if(index != -1) {
		this.splice(index, 1);
		return true;
	}
}

Array.prototype.where = function(predicate) {
     var ret = [];
     for (var i = 0; i < this.length; ++i) {
         if (predicate(this[i], i))
             ret.push(this[i]);
     }
     return ret;
 };
 
Array.prototype.first = function(predicate) {
	for(var i = 0; i < this.length; ++i) {
		if(predicate(this[i]))
			return this[i];
	}
}

Array.prototype.get = function(index) {
	if(index >= 0)
		return this[index];
	else
		return this[this.length + index];
}