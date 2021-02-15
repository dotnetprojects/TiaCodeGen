using TiaCodegen.Commands;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Blocks
{
    public class Network : BaseOperationOrSignal
    {
        public string NetworkTitle { get; set; }

        public string Description { get; set; }

        public string NetworkTitleEnglish { get; set; }

        public string DescriptionEnglish { get; set; }

        public Network(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }


        public Network(string networkTitle, string networkTitleEnglish, params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        {
            NetworkTitle = networkTitle;
            NetworkTitleEnglish = networkTitleEnglish;
        }
    }
}
