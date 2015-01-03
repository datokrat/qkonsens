export class Command {}

export interface ChainMiddleware<Args> {
    (args: Args): boolean;
}

export class Chain<Args> {
    public run(args: Args): boolean {
        for(var i=0; i < this.middleware.length; ++i) {
            if(this.middleware[i](args)) return true;
        }
        return false;
    }
    
    public insertAtBeginning(mw: ChainMiddleware<Args>) {
        this.middleware = [mw].concat(this.middleware);
    }
    
    public append(mw: ChainMiddleware<Args>) {
        this.middleware.push(mw);
    }
    
    private middleware: ChainMiddleware<Args>[] = [];
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
}