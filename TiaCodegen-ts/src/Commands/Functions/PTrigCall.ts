import { Signal } from '../Signals/Signal.js';
import { IPartName } from '../../Interfaces/IPartName.js';
import { BaseNPCoil } from '../Coils/BaseNPCoil.js';

export interface PTrigCallOptions {
    signal: Signal;
}

export class PTrigCall extends BaseNPCoil implements IPartName {
    partName: string;

    constructor(options: PTrigCallOptions) {
        const { signal } = options;
        super(signal, null, null);
        this.partName = 'PBox';
    }
}
