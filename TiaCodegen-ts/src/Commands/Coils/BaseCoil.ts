import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { ICoil } from '../../Interfaces/ICoil';
import { Signal } from '../Signals/Signal';

export class BaseCoil implements IOperationOrSignal, ICoil {
    debugInfo: string | null = null;
    negated: boolean = false;
    signal: Signal;
    children: IOperationOrSignal[];
    operationId: number = 0;
    parent: IOperationOrSignal | null = null;
    doNotCreateContact: boolean = false;
    cardinality: number = 0;

    constructor(signal: Signal, op: IOperationOrSignal | null = null) {
        this.signal = signal;
        this.children = [];
        this.children.push(signal);
        if (op !== null) {
            this.children.push(op);
        }
    }

    createContactAndFillCardinality(_parent: IOperationOrSignal): number {
        this.cardinality = 1;
        return 1;
    }

    toString(): string {
        return this.constructor.name;
    }

    clone(): IOperationOrSignal {
        const inst = new (this.constructor as new (s: Signal) => BaseCoil)(this.signal.clone() as Signal);
        inst.debugInfo = this.debugInfo;
        inst.negated = this.negated;
        for (const c of this.children.slice(1)) {
            inst.children.push(c.clone());
        }
        return inst;
    }
}
