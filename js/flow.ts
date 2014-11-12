export interface Flow {
	doSync();
}

export interface SyncCommand<T> {
	(): void;
}