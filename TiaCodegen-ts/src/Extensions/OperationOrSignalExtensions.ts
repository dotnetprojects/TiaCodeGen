import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';

export function tryGetParent<T extends IOperationOrSignal>(
    op: IOperationOrSignal,
    ctor: new (...args: any[]) => T,
): T | null {
    let chk = op.parent;
    while (chk !== null && chk !== undefined) {
        if (chk instanceof ctor) return chk as T;
        chk = chk.parent;
    }
    return null;
}
