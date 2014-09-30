export interface Observable<T> {
	(): T;
	(T): void;
	subscribe( callback: (T) => void ): Subscription;
	
	dispose(): void;
}

export interface ObservableArray<T> extends Observable<T[]> {
	push(item: T): void;
	remove(item: T): void;
}

export interface Subscription {
	dispose(): void;
}