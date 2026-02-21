import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { ICoil } from '../../Interfaces/ICoil';
import { Signal } from '../Signals/Signal';
export declare class BaseCoil implements IOperationOrSignal, ICoil {
    debugInfo: string | null;
    negated: boolean;
    signal: Signal;
    children: IOperationOrSignal[];
    operationId: number;
    parent: IOperationOrSignal | null;
    doNotCreateContact: boolean;
    cardinality: number;
    constructor(signal: Signal, op?: IOperationOrSignal | null);
    createContactAndFillCardinality(_parent: IOperationOrSignal): number;
    toString(): string;
    clone(): IOperationOrSignal;
}
//# sourceMappingURL=BaseCoil.d.ts.map