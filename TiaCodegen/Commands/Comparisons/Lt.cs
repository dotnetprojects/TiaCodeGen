using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public class Lt : CompareOperator // <
    {
        public Lt(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
