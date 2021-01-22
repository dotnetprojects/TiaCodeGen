using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public class Gt : CompareOperator // >
    {
        public Gt(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
