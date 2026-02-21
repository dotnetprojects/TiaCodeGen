import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
export declare abstract class BaseOperationOrSignal implements IOperationOrSignal {
    debugInfo: string | null;
    private _operationId;
    children: IOperationOrSignal[];
    parent: IOperationOrSignal | null;
    doNotCreateContact: boolean;
    private _cardinality;
    get cardinality(): number;
    set cardinality(value: number);
    constructor(...operationOrSignals: IOperationOrSignal[]);
    get operationId(): number;
    set operationId(value: number);
    createContactAndFillCardinality(parent: IOperationOrSignal): number;
    add(...operationOrSignals: IOperationOrSignal[]): void;
    toString(): string;
    getFirstChildNotAnd(): IOperationOrSignal;
    clone(): IOperationOrSignal;
}
//# sourceMappingURL=BaseOperationOrSignal.d.ts.map