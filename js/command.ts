export class Command {}

export interface ChainMiddleware<Args> {
    (args: Args, mode: ChainMode): boolean;
}

export enum ChainMode {
	Run,
	Flood
}

export class Chain<Args> {
    public run(args: Args): boolean {
        for(var i=0; i < this.middleware.length; ++i)
            if(this.middleware[i](args, ChainMode.Run)) return true;
        return false;
    }
	
	public flood(args: Args): void {
		for(var i=0; i < this.middleware.length; ++i)
			this.middleware[i](args, ChainMode.Flood);
	}
	
	public runOrFlood(args: Args, mode: ChainMode): boolean {
		if(mode == ChainMode.Run) return this.run(args);
		else {
			this.flood(args);
			return false;
		}
	}
    
    public insertAtBeginning(mw: ChainMiddleware<Args>) {
        this.middleware = [mw].concat(this.middleware);
    }
    
    public append(mw: ChainMiddleware<Args>): DisposableOperation {
        this.middleware.push(mw);
		return { dispose: () => this.middleware.removeOne(mw) };
    }
    
    private middleware: ChainMiddleware<Args>[] = [];
}

export interface DisposableOperation {
	dispose(): void;
}

export interface CommandControl {
    commandProcessor: CommandProcessor;
}

export class CommandProcessor {
    public parent: CommandProcessor;
    public chain = new Chain<Command>();
    
    public processCommand(cmd: Command) {
        if(!this.chain.run(cmd)) {
            if(this.parent) this.parent.processCommand(cmd);
            else throw new Error('command not processable: ' + cmd);
        }
    }
	
	public floodCommand(cmd: Command) {
		this.chain.flood(cmd);
	}
}