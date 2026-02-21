import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper';
export declare class FunctionCall implements IOperationOrSignal {
    safetyTemplateString: string | null;
    debugInfo: string | null;
    disableEno: boolean;
    functionName: string;
    version: string | null;
    additionalInnerXml: string | null;
    /** Interface map - using plain object to preserve insertion order */
    iface: Record<string, IOperationOrSignalDirectionWrapper>;
    additionalSafetyTemplateValues: string | null;
    children: IOperationOrSignal[];
    eno: IOperationOrSignal | null;
    operationId: number;
    parent: IOperationOrSignal | null;
    doNotCreateContact: boolean;
    cardinality: number;
    hasNoEn: boolean;
    constructor(functionName: string, eno?: IOperationOrSignal | null);
    createContactAndFillCardinality(_parent: IOperationOrSignal): number;
    toString(): string;
    clone(): IOperationOrSignal;
}
//# sourceMappingURL=FunctionCall.d.ts.map