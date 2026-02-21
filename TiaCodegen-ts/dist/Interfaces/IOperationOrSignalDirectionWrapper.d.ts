import { IOperationOrSignal } from './IOperationOrSignal';
import { Direction } from '../Enums/Direction';
import { SignalType } from '../Enums/SignalType';
export declare class IOperationOrSignalDirectionWrapper {
    operationOrSignal: IOperationOrSignal | null;
    direction: Direction;
    length: number;
    type: SignalType | null;
    constructor(operationOrSignal: IOperationOrSignal | null, direction: Direction, type?: SignalType | null, length?: number);
}
//# sourceMappingURL=IOperationOrSignalDirectionWrapper.d.ts.map