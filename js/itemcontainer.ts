export interface Base<T> {
	set(id: number, value: T): T;
	get(id: number): T;
}

export class Main<T> implements Base<T> {
	public get(id: number): T {
		var ret = this.items[id];
		if(ret) return ret;
		else throw new Error('item does not exist: id = ' + id);
	}
	
	public set(id: number, value: T): T {
		return this.items[id] = value;
	}
	
	private items = {};
}