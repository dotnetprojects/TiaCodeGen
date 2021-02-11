using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions.Arithmetic
{
    public abstract class VariableArithmeticCall : ArithmeticCall
    {
        public VariableArithmeticCall(string functionName, IOperationOrSignal eno = null) : base(functionName, eno)
        {
        }
    }
}
