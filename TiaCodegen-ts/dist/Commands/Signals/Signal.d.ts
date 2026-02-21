import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { SignalType } from '../../Enums/SignalType';
import { StringBuilder } from '../../utils/StringBuilder';
export declare class Signal implements IOperationOrSignal {
    debugInfo: string | null;
    operationId: number;
    signalId: number;
    name: string;
    description: string | null;
    signalType: SignalType;
    customType: string | null;
    children: IOperationOrSignal[];
    parent: IOperationOrSignal | null;
    doNotCreateContact: boolean;
    cardinality: number;
    constructor(nameOrValue: string | number | boolean, signalType?: SignalType, customType?: string, description?: string);
    createContactAndFillCardinality(_parent: IOperationOrSignal): number;
    escape(txt: string): string;
    unescape(txt: string): string;
    clone(): IOperationOrSignal;
    addXmlToStringBuilder(id: number, sb: StringBuilder): void;
    toString(): string;
}
export declare class FixedSignal extends Signal {
    constructor(name: string, signalType?: SignalType, customType?: string);
}
export declare class FixedPeripherySignal extends FixedSignal {
    constructor(name: string, signalType?: SignalType, customType?: string);
}
//# sourceMappingURL=Signal.d.ts.map