export interface Observable<T> {
	(): T;
	(T): void;
	subscribe( callback: (T) => void ): void;
	
	dispose(): void;
}