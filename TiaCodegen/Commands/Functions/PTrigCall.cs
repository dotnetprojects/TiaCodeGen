using TiaCodegen.Commands.Coils;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class PTrigCall : BaseNPCoil, IPartName
    {
        public PTrigCall(Signal signal) : base(signal, null, null)
        {
            PartName = "PBox";
        }

        public string PartName { get; set; }
    }
}
