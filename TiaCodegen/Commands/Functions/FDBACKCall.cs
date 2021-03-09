using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class FDBACK : SystemFunctionBlockCall
    {
        public FDBACK(string instanceName,
            IOperationOrSignal on = null,
            IOperationOrSignal feedback = null,
            IOperationOrSignal qbad_fio = null,
            IOperationOrSignal ack_nec = null,
            IOperationOrSignal ack = null,
            IOperationOrSignal fdb_time = null,
            IOperationOrSignal q = null,
            IOperationOrSignal error = null,
            IOperationOrSignal ack_req = null,
            IOperationOrSignal diag = null) : base("FDBACK", instanceName, null)
        {
            Interface["ON"] = new IOperationOrSignalDirectionWrapper(on, Direction.Input);
            Interface["FEEDBACK"] = new IOperationOrSignalDirectionWrapper(feedback, Direction.Input);
            Interface["QBAD_FIO"] = new IOperationOrSignalDirectionWrapper(qbad_fio, Direction.Input);
            Interface["ACK_NEC"] = new IOperationOrSignalDirectionWrapper(ack_nec, Direction.Input);
            Interface["ACK"] = new IOperationOrSignalDirectionWrapper(ack, Direction.Input);
            Interface["FDB_TIME"] = new IOperationOrSignalDirectionWrapper(fdb_time, Direction.Input);
            Interface["Q"] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);
            Interface["ERROR"] = new IOperationOrSignalDirectionWrapper(error, Direction.Output);
            Interface["ACK_REQ"] = new IOperationOrSignalDirectionWrapper(ack_req, Direction.Output);
            Interface["DIAG"] = new IOperationOrSignalDirectionWrapper(diag, Direction.Output);

            SafetyTemplateString = @"      <TemplateValue Name=""f_user_card"" Type=""Cardinality"">1</TemplateValue>
      <TemplateValue Name=""f_image_card"" Type=""Cardinality"">0</TemplateValue>";

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
