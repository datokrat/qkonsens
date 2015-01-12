export interface Disposable {
    dispose(): void;
}

export class DisposableBase implements Disposable {
    public dispose() {}
}

export class DisposableContainer implements Disposable {
    public append(disposable: Disposable): Disposable;
    public append(disposables: Disposable[]): Disposable[];
    
    public append(arg: any): any {
        if(arg instanceof Array)
            this.disposables = this.disposables.concat(<Disposable[]>arg);
        else if('dispose' in arg) {
            this.disposables.push(<Disposable>arg);
            return arg;
        }
    }
    
    public dispose() {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
    
    private disposables: Disposable[] = [];
}