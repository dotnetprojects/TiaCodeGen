import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { Signal } from './Signals/Signal';
export declare class Not implements IOperationOrSignal {
    debugInfo: string | null;
    children: IOperationOrSignal[];
    operationId: number;
    doNotCreateContact: boolean;
    cardinality: number;
    parent: IOperationOrSignal | null;
    constructor(signal: Signal);
    createContactAndFillCardinality(_parent: IOperationOrSignal): number;
    clone(): IOperationOrSignal;
    toString(): string;
}
//# sourceMappingURL=Not.d.ts.map