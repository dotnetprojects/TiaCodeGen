import { IOperationOrSignal } from './IOperationOrSignal';
import { Direction } from '../Enums/Direction';
import { SignalType } from '../Enums/SignalType';

export class IOperationOrSignalDirectionWrapper {
    operationOrSignal: IOperationOrSignal | null;
    direction: Direction;
    length: number;
    type: SignalType | null;

    constructor(
        operationOrSignal: IOperationOrSignal | null,
        direction: Direction,
        type: SignalType | null = null,
        length: number = 0,
    ) {
        this.operationOrSignal = operationOrSignal;
        this.direction = direction;
        this.length = length;
        this.type = type;
    }
}
