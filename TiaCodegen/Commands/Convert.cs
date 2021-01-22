using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public class Convert : BaseOperationOrSignal, IFunctionOperation
    {
        public Convert(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
