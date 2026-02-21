"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FTrigCall = exports.FDBACKCall = exports.CTUDCall = exports.CTUCall = exports.AckGlCall = exports.ModCall = exports.DivCall = exports.SubCall = exports.MulCall = exports.AddCall = exports.VariableArithmeticCall = exports.ArithmeticCall = exports.SystemFunctionBlockCall = exports.SystemFunctionCall = exports.FunctionBlockCall = exports.FunctionCall = exports.OutRangeCall = exports.InRangeCall = exports.Lt = exports.Le = exports.Gt = exports.Ge = exports.Ne = exports.Eq = exports.CompareOperator = exports.SCoil = exports.RCoil = exports.PCoil = exports.Coil = exports.BaseNPCoil = exports.BaseCoil = exports.FixedPeripherySignal = exports.FixedSignal = exports.Signal = exports.NCoil = exports.S_Move = exports.Convert = exports.Move = exports.Distributor = exports.Not = exports.Or = exports.And = exports.BaseOperationOrSignal = exports.tryGetParent = exports.NaturalComparer = exports.flatten = exports.StringBuilder = exports.IOperationOrSignalDirectionWrapper = exports.SignalType = exports.Direction = void 0;
exports.KopCodeHelper = exports.Block = exports.Network = exports.CodeBlock = exports.TPCall = exports.TONRCall = exports.TONCall = exports.TOFCall = exports.RTrigCall = exports.PTrigCall = exports.NTrigCall = void 0;
// Enums
var Direction_1 = require("./Enums/Direction");
Object.defineProperty(exports, "Direction", { enumerable: true, get: function () { return Direction_1.Direction; } });
var SignalType_1 = require("./Enums/SignalType");
Object.defineProperty(exports, "SignalType", { enumerable: true, get: function () { return SignalType_1.SignalType; } });
var IOperationOrSignalDirectionWrapper_1 = require("./Interfaces/IOperationOrSignalDirectionWrapper");
Object.defineProperty(exports, "IOperationOrSignalDirectionWrapper", { enumerable: true, get: function () { return IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper; } });
// Utils
var StringBuilder_1 = require("./utils/StringBuilder");
Object.defineProperty(exports, "StringBuilder", { enumerable: true, get: function () { return StringBuilder_1.StringBuilder; } });
// Internal
var IEnumerableExtensions_1 = require("./Internal/IEnumerableExtensions");
Object.defineProperty(exports, "flatten", { enumerable: true, get: function () { return IEnumerableExtensions_1.flatten; } });
// Extensions
var NaturalComparer_1 = require("./Extensions/NaturalComparer");
Object.defineProperty(exports, "NaturalComparer", { enumerable: true, get: function () { return NaturalComparer_1.NaturalComparer; } });
var OperationOrSignalExtensions_1 = require("./Extensions/OperationOrSignalExtensions");
Object.defineProperty(exports, "tryGetParent", { enumerable: true, get: function () { return OperationOrSignalExtensions_1.tryGetParent; } });
// Commands
var BaseOperationOrSignal_1 = require("./Commands/BaseOperationOrSignal");
Object.defineProperty(exports, "BaseOperationOrSignal", { enumerable: true, get: function () { return BaseOperationOrSignal_1.BaseOperationOrSignal; } });
var And_1 = require("./Commands/And");
Object.defineProperty(exports, "And", { enumerable: true, get: function () { return And_1.And; } });
var Or_1 = require("./Commands/Or");
Object.defineProperty(exports, "Or", { enumerable: true, get: function () { return Or_1.Or; } });
var Not_1 = require("./Commands/Not");
Object.defineProperty(exports, "Not", { enumerable: true, get: function () { return Not_1.Not; } });
var Distributor_1 = require("./Commands/Distributor");
Object.defineProperty(exports, "Distributor", { enumerable: true, get: function () { return Distributor_1.Distributor; } });
var Move_1 = require("./Commands/Move");
Object.defineProperty(exports, "Move", { enumerable: true, get: function () { return Move_1.Move; } });
var Convert_1 = require("./Commands/Convert");
Object.defineProperty(exports, "Convert", { enumerable: true, get: function () { return Convert_1.Convert; } });
var S_Move_1 = require("./Commands/S_Move");
Object.defineProperty(exports, "S_Move", { enumerable: true, get: function () { return S_Move_1.S_Move; } });
var NCoil_1 = require("./Commands/NCoil");
Object.defineProperty(exports, "NCoil", { enumerable: true, get: function () { return NCoil_1.NCoil; } });
// Signals
var Signal_1 = require("./Commands/Signals/Signal");
Object.defineProperty(exports, "Signal", { enumerable: true, get: function () { return Signal_1.Signal; } });
Object.defineProperty(exports, "FixedSignal", { enumerable: true, get: function () { return Signal_1.FixedSignal; } });
Object.defineProperty(exports, "FixedPeripherySignal", { enumerable: true, get: function () { return Signal_1.FixedPeripherySignal; } });
// Coils
var BaseCoil_1 = require("./Commands/Coils/BaseCoil");
Object.defineProperty(exports, "BaseCoil", { enumerable: true, get: function () { return BaseCoil_1.BaseCoil; } });
var BaseNPCoil_1 = require("./Commands/Coils/BaseNPCoil");
Object.defineProperty(exports, "BaseNPCoil", { enumerable: true, get: function () { return BaseNPCoil_1.BaseNPCoil; } });
var Coil_1 = require("./Commands/Coils/Coil");
Object.defineProperty(exports, "Coil", { enumerable: true, get: function () { return Coil_1.Coil; } });
var PCoil_1 = require("./Commands/Coils/PCoil");
Object.defineProperty(exports, "PCoil", { enumerable: true, get: function () { return PCoil_1.PCoil; } });
var RCoil_1 = require("./Commands/Coils/RCoil");
Object.defineProperty(exports, "RCoil", { enumerable: true, get: function () { return RCoil_1.RCoil; } });
var SCoil_1 = require("./Commands/Coils/SCoil");
Object.defineProperty(exports, "SCoil", { enumerable: true, get: function () { return SCoil_1.SCoil; } });
// Comparisons
var CompareOperator_1 = require("./Commands/Comparisons/CompareOperator");
Object.defineProperty(exports, "CompareOperator", { enumerable: true, get: function () { return CompareOperator_1.CompareOperator; } });
var Eq_1 = require("./Commands/Comparisons/Eq");
Object.defineProperty(exports, "Eq", { enumerable: true, get: function () { return Eq_1.Eq; } });
var Ne_1 = require("./Commands/Comparisons/Ne");
Object.defineProperty(exports, "Ne", { enumerable: true, get: function () { return Ne_1.Ne; } });
var Ge_1 = require("./Commands/Comparisons/Ge");
Object.defineProperty(exports, "Ge", { enumerable: true, get: function () { return Ge_1.Ge; } });
var Gt_1 = require("./Commands/Comparisons/Gt");
Object.defineProperty(exports, "Gt", { enumerable: true, get: function () { return Gt_1.Gt; } });
var Le_1 = require("./Commands/Comparisons/Le");
Object.defineProperty(exports, "Le", { enumerable: true, get: function () { return Le_1.Le; } });
var Lt_1 = require("./Commands/Comparisons/Lt");
Object.defineProperty(exports, "Lt", { enumerable: true, get: function () { return Lt_1.Lt; } });
var InRangeCall_1 = require("./Commands/Comparisons/InRangeCall");
Object.defineProperty(exports, "InRangeCall", { enumerable: true, get: function () { return InRangeCall_1.InRangeCall; } });
var OutRangeCall_1 = require("./Commands/Comparisons/OutRangeCall");
Object.defineProperty(exports, "OutRangeCall", { enumerable: true, get: function () { return OutRangeCall_1.OutRangeCall; } });
// Function Base
var FunctionCall_1 = require("./Commands/Functions/Base/FunctionCall");
Object.defineProperty(exports, "FunctionCall", { enumerable: true, get: function () { return FunctionCall_1.FunctionCall; } });
var FunctionBlockCall_1 = require("./Commands/Functions/Base/FunctionBlockCall");
Object.defineProperty(exports, "FunctionBlockCall", { enumerable: true, get: function () { return FunctionBlockCall_1.FunctionBlockCall; } });
var SystemFunctionCall_1 = require("./Commands/Functions/Base/SystemFunctionCall");
Object.defineProperty(exports, "SystemFunctionCall", { enumerable: true, get: function () { return SystemFunctionCall_1.SystemFunctionCall; } });
var SystemFunctionBlockCall_1 = require("./Commands/Functions/Base/SystemFunctionBlockCall");
Object.defineProperty(exports, "SystemFunctionBlockCall", { enumerable: true, get: function () { return SystemFunctionBlockCall_1.SystemFunctionBlockCall; } });
// Arithmetic
var ArithmeticCall_1 = require("./Commands/Functions/Arithmetic/ArithmeticCall");
Object.defineProperty(exports, "ArithmeticCall", { enumerable: true, get: function () { return ArithmeticCall_1.ArithmeticCall; } });
var VariableArithmeticCall_1 = require("./Commands/Functions/Arithmetic/VariableArithmeticCall");
Object.defineProperty(exports, "VariableArithmeticCall", { enumerable: true, get: function () { return VariableArithmeticCall_1.VariableArithmeticCall; } });
var AddCall_1 = require("./Commands/Functions/Arithmetic/AddCall");
Object.defineProperty(exports, "AddCall", { enumerable: true, get: function () { return AddCall_1.AddCall; } });
var MulCall_1 = require("./Commands/Functions/Arithmetic/MulCall");
Object.defineProperty(exports, "MulCall", { enumerable: true, get: function () { return MulCall_1.MulCall; } });
var SubCall_1 = require("./Commands/Functions/Arithmetic/SubCall");
Object.defineProperty(exports, "SubCall", { enumerable: true, get: function () { return SubCall_1.SubCall; } });
var DivCall_1 = require("./Commands/Functions/Arithmetic/DivCall");
Object.defineProperty(exports, "DivCall", { enumerable: true, get: function () { return DivCall_1.DivCall; } });
var ModCall_1 = require("./Commands/Functions/Arithmetic/ModCall");
Object.defineProperty(exports, "ModCall", { enumerable: true, get: function () { return ModCall_1.ModCall; } });
// Functions
var AckGlCall_1 = require("./Commands/Functions/AckGlCall");
Object.defineProperty(exports, "AckGlCall", { enumerable: true, get: function () { return AckGlCall_1.AckGlCall; } });
var CTUCall_1 = require("./Commands/Functions/CTUCall");
Object.defineProperty(exports, "CTUCall", { enumerable: true, get: function () { return CTUCall_1.CTUCall; } });
var CTUDCall_1 = require("./Commands/Functions/CTUDCall");
Object.defineProperty(exports, "CTUDCall", { enumerable: true, get: function () { return CTUDCall_1.CTUDCall; } });
var FDBACKCall_1 = require("./Commands/Functions/FDBACKCall");
Object.defineProperty(exports, "FDBACKCall", { enumerable: true, get: function () { return FDBACKCall_1.FDBACKCall; } });
var FTrigCall_1 = require("./Commands/Functions/FTrigCall");
Object.defineProperty(exports, "FTrigCall", { enumerable: true, get: function () { return FTrigCall_1.FTrigCall; } });
var NTrigCall_1 = require("./Commands/Functions/NTrigCall");
Object.defineProperty(exports, "NTrigCall", { enumerable: true, get: function () { return NTrigCall_1.NTrigCall; } });
var PTrigCall_1 = require("./Commands/Functions/PTrigCall");
Object.defineProperty(exports, "PTrigCall", { enumerable: true, get: function () { return PTrigCall_1.PTrigCall; } });
var RTrigCall_1 = require("./Commands/Functions/RTrigCall");
Object.defineProperty(exports, "RTrigCall", { enumerable: true, get: function () { return RTrigCall_1.RTrigCall; } });
var TOFCall_1 = require("./Commands/Functions/TOFCall");
Object.defineProperty(exports, "TOFCall", { enumerable: true, get: function () { return TOFCall_1.TOFCall; } });
var TONCall_1 = require("./Commands/Functions/TONCall");
Object.defineProperty(exports, "TONCall", { enumerable: true, get: function () { return TONCall_1.TONCall; } });
var TONRCall_1 = require("./Commands/Functions/TONRCall");
Object.defineProperty(exports, "TONRCall", { enumerable: true, get: function () { return TONRCall_1.TONRCall; } });
var TPCall_1 = require("./Commands/Functions/TPCall");
Object.defineProperty(exports, "TPCall", { enumerable: true, get: function () { return TPCall_1.TPCall; } });
// Blocks
var CodeBlock_1 = require("./Blocks/CodeBlock");
Object.defineProperty(exports, "CodeBlock", { enumerable: true, get: function () { return CodeBlock_1.CodeBlock; } });
var Network_1 = require("./Blocks/Network");
Object.defineProperty(exports, "Network", { enumerable: true, get: function () { return Network_1.Network; } });
var Block_1 = require("./Blocks/Block");
Object.defineProperty(exports, "Block", { enumerable: true, get: function () { return Block_1.Block; } });
// CodeGen
var KopCodeHelper_1 = require("./CodeGen/KopCodeHelper");
Object.defineProperty(exports, "KopCodeHelper", { enumerable: true, get: function () { return KopCodeHelper_1.KopCodeHelper; } });
//# sourceMappingURL=index.js.map