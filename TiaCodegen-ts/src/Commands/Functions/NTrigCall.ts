import { Signal } from '../Signals/Signal.js';
import { IPartName } from '../../Interfaces/IPartName.js';
import { BaseNPCoil } from '../Coils/BaseNPCoil.js';

export interface NTrigCallOptions {
    signal: Signal;
}

export class NTrigCall extends BaseNPCoil implements IPartName {
    partName: string;

    constructor(options: NTrigCallOptions) {
        const { signal } = options;
        super(signal, null, null);
        this.partName = 'NBox';
    }
}
