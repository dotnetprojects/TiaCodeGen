using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions.Arithmetic
{
    public abstract class ArithmeticCall : SystemFunctionCall
    {
        public string Type { get; set; }

        public ArithmeticCall(string functionName, IOperationOrSignal eno = null) : base(functionName, eno)
        {
        }
    }
}
