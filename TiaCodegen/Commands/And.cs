using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public class And : BaseOperationOrSignal
    {
        public And(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
