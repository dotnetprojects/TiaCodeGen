using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public class S_Move : BaseOperationOrSignal, IFunctionOperation
    {
        public S_Move(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }

        public override int Cardinality { get { return 1; } }
    }
}
