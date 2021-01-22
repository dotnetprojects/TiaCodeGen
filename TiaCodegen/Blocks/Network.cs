using TiaCodegen.Commands;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Blocks
{
    public class Network : BaseOperationOrSignal
    {
        public string NetworkTitle { get; set; }

        public string Description { get; set; }

        public Network(string networkTitle = null, params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        {
            NetworkTitle = networkTitle;
        }

        public Network(string networkTitle, string description, params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        {
            NetworkTitle = networkTitle;
            Description = description;
        }
    }
}
