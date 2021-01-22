using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions.Base
{
    public class FunctionBlockCall : FunctionCall
    {
        public string InstanceName { get; set; }

        public FunctionBlockCall(string functionName, string instanceName, IOperationOrSignal eno = null) : base(functionName, eno)
        {
            FunctionName = functionName;
            InstanceName = instanceName;
        }
    }
}
