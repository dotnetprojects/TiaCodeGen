import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal.js';

export abstract class BaseOperationOrSignal implements IOperationOrSignal {
    debugInfo: string | null = null;
    private _operationId: number = 0;
    children: IOperationOrSignal[];
    parent: IOperationOrSignal | null = null;
    doNotCreateContact: boolean = false;
    private _cardinality: number = 0;

    get cardinality(): number { return this._cardinality; }
    set cardinality(value: number) { this._cardinality = value; }

    constructor(...operationOrSignals: IOperationOrSignal[]) {
        this.children = [];
        if (operationOrSignals) {
            this.children.push(...operationOrSignals);
        }
    }

    get operationId(): number { return this._operationId; }
    set operationId(value: number) { this._operationId = value; }

    createContactAndFillCardinality(parent: IOperationOrSignal): number {
        this.cardinality = 1;
        const lastChild = this.children[this.children.length - 1];
        if (this.children.length > 0 && lastChild.constructor.name === 'Or') {
            this.cardinality = lastChild.createContactAndFillCardinality(parent);
            lastChild.doNotCreateContact = true;
        }
        return this.cardinality;
    }

    add(...operationOrSignals: IOperationOrSignal[]): void {
        this.children.push(...operationOrSignals);
    }

    toString(): string {
        const name = this.constructor.name;
        if (name === 'And' || name === 'Or') {
            return `${name} (${this.children.map(x => x.toString()).join(',')})`;
        }
        return name;
    }

    getFirstChildNotAnd(): IOperationOrSignal {
        if (this.constructor.name === 'And') {
            const ch1 = this.children[0];
            if (ch1 instanceof BaseOperationOrSignal) {
                return ch1.getFirstChildNotAnd();
            }
        }
        return this;
    }

    clone(): IOperationOrSignal {
        // Subclasses that need cloning should override this.
        // Generic approach: create a new instance of the same class.
        const inst = new (this.constructor as new () => BaseOperationOrSignal)();
        inst.debugInfo = this.debugInfo;
        inst.doNotCreateContact = this.doNotCreateContact;
        for (const c of this.children) {
            inst.children.push(c.clone());
        }
        return inst;
    }
}
