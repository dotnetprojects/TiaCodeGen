import { SystemFunctionCall, SystemFunctionCallOptions } from '../Base/SystemFunctionCall.js';

export interface ArithmeticCallOptions extends SystemFunctionCallOptions { }

export type numericType = "Int" | "DInt" | "LInt" | "UInt" | "UDInt" | "ULInt" | "Real";

export abstract class ArithmeticCall extends SystemFunctionCall {
    type?: numericType = 'Int';

    constructor(options: ArithmeticCallOptions) {
        super(options);
    }
}
