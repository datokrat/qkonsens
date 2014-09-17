class ControllerChild< Mdl, Vm, Com, Ctr extends IController > implements Disposable {
	constructor(controller: { new(m: Mdl, v: Vm, c: Com): Ctr }) {
		this.Controller = controller;
	}
	
	public setModel(m: () => Mdl) {
		this.m = m;
		this.update();
	}
	
	public setViewModel(v: () => Vm) {
		this.v = v;
		this.update();
	}
	
	public setCommunicator(c: () => Com) {
		this.c = c;
		this.update();
	}
	
	public enable() {
		this.enabled = true;
		this.update();
	}
	
	public disable() {
		this.enabled = false;
		this.disposeController();
	}
	
	public update() {
		if(this.enabled == false) return;
		
		this.disposeController();
		this.initController();
	}
	
	private disposeController() {
		if(this.controller) this.controller.dispose();
	}
	
	private initController() {
		this.controller = new this.Controller(this.m(), this.v(), this.c());
	}
	
	public dispose() {
		this.disposeController();
	}
	
	private Controller: { new(m: Mdl, v: Vm, C: Com): Ctr };
	
	private m: () => Mdl;
	private v: () => Vm;
	private c: () => Com;
	private controller: Ctr;
	
	private enabled = false;
}

class ControllerCore {
	public child<Mdl, Vm, Com, Ctr extends IController>
		( ConstructorClass: { new(m: Mdl, v: Vm, c: Com): Ctr },
		  mFn: () => Mdl, vFn: () => Vm, cFn: () => Com )
	{
		var child = new ControllerChild<Mdl, Vm, Com, Ctr>(ConstructorClass);
		child.setModel(mFn);
		child.setViewModel(vFn);
		child.setCommunicator(cFn);
		child.enable();
		
		this.children.push(child);
		
		return child;
	}
	
	public dispose() {
		this.children.forEach( child => {
			child.dispose();
		} )
	}
	
	private children: Disposable[] = [];
}

class IController implements Disposable {
	dispose() {}
}

interface Disposable {
	dispose();
}