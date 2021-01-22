using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions.Base
{
    public class SystemFunctionBlockCall : FunctionBlockCall
    {
        public SystemFunctionBlockCall(string functionName, string instanceName, IOperationOrSignal eno = null) : base(functionName, instanceName, eno)
        {
        }

        public string TemplateValueName { get; set; }
        public string TemplateValueType { get; set; }
        public string TemplateValue { get; set; }
    }
}
