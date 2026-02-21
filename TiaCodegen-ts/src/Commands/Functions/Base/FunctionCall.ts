import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../../Enums/Direction.js';

export class FunctionCall implements IOperationOrSignal {
    safetyTemplateString: string | null = null;
    debugInfo: string | null = null;
    disableEno: boolean = false;
    functionName: string;
    version: string | null = null;
    additionalInnerXml: string | null = null;
    /** Interface map - using plain object to preserve insertion order */
    iface: Record<string, IOperationOrSignalDirectionWrapper>;
    additionalSafetyTemplateValues: string | null = null;
    children: IOperationOrSignal[];
    eno: IOperationOrSignal | null;
    operationId: number = 0;
    parent: IOperationOrSignal | null = null;
    doNotCreateContact: boolean = false;
    cardinality: number = 0;
    hasNoEn: boolean = false;

    constructor(functionName: string, eno: IOperationOrSignal | null = null) {
        this.functionName = functionName;
        this.iface = {};
        this.children = [];
        this.eno = eno;
        if (eno !== null) {
            this.iface['eno'] = new IOperationOrSignalDirectionWrapper(eno, Direction.Eno);
        }
    }

    createContactAndFillCardinality(_parent: IOperationOrSignal): number {
        this.cardinality = 1;
        return this.cardinality;
    }

    toString(): string {
        return `${this.constructor.name}(${this.functionName})`;
    }

    clone(): IOperationOrSignal {
        throw new Error('Not yet supported');
    }
}
