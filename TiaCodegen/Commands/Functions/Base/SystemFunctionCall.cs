using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions.Base
{
    public class SystemFunctionCall : FunctionCall
    {
        public SystemFunctionCall(string functionName, IOperationOrSignal eno = null) : base(functionName, eno)
        {
        }
    }
}
