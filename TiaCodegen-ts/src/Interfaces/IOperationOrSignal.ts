export interface IOperationOrSignal {
    children: IOperationOrSignal[];
    parent: IOperationOrSignal | null;
    operationId: number;
    doNotCreateContact: boolean;
    cardinality: number;
    debugInfo: string | null;
    createContactAndFillCardinality(parent: IOperationOrSignal): number;
    clone(): IOperationOrSignal;
    toString(): string;
}
