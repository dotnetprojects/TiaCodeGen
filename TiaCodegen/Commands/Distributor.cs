using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public class Distributor : BaseOperationOrSignal
    {
        public Distributor(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }

        public override int CreateContactAndFillCardinality(IOperationOrSignal parent)
        {
            int c = 0;
            this.OperationId = parent.OperationId;
            foreach (var op in Children)
            {
                c += op.CreateContactAndFillCardinality(this);
            }

            this.Cardinality = c;
            return this.Cardinality;
        }
    }
}
