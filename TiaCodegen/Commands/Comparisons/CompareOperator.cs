using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public abstract class CompareOperator : BaseOperationOrSignal
    {
        public CompareOperator(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
