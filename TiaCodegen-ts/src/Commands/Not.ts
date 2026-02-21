import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal.js';
import { Signal } from './Signals/Signal.js';

export class Not implements IOperationOrSignal {
    debugInfo: string | null = null;
    children: IOperationOrSignal[];
    operationId: number = 0;
    doNotCreateContact: boolean = false;
    cardinality: number = 0;
    parent: IOperationOrSignal | null = null;

    constructor(signal: Signal) {
        this.children = [];
        this.children.push(signal);
    }

    createContactAndFillCardinality(_parent: IOperationOrSignal): number {
        this.cardinality = 1;
        return this.cardinality;
    }

    clone(): IOperationOrSignal {
        return new Not(this.children[0].clone() as Signal);
    }

    toString(): string {
        return this.constructor.name;
    }
}
