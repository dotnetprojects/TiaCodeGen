using System;
using System.Collections.Generic;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions.Base
{
    public class FunctionCall : IOperationOrSignal
    {
        public string DebugInfo { get; set; }

        public bool DisableEno { get; set; }

        public string FunctionName { get; set; }

        public string Version { get; set; }

        public string AdditionalInnerXml { get; set; }

        public Dictionary<string, IOperationOrSignalDirectionWrapper> Interface { get; set; }

        public FunctionCall(string functionName, IOperationOrSignal eno = null)
        {
            FunctionName = functionName;
            Interface = new Dictionary<string, IOperationOrSignalDirectionWrapper>();
            Children = new List<IOperationOrSignal>();
            ENO = eno;
            if (eno != null)
            {
                Interface["eno"] = new IOperationOrSignalDirectionWrapper(eno, Direction.Eno);
            }
        }

        public string AdditionalSafetyTemplateValues { get; set; }

        public virtual List<IOperationOrSignal> Children { get; set; }

        public IOperationOrSignal ENO { get; set; }

        public ulong OperationId { get; set; }

        public IOperationOrSignal Parent { get; set; }

        public bool DoNotCreateContact { get; set; }

        public int Cardinality { get; set; }

        public bool HasNoEn { get; set; }

        public virtual int CreateContactAndFillCardinality(IOperationOrSignal parent)
        {
            this.Cardinality = 1;
            return this.Cardinality;
        }

        public override string ToString()
        {
            return this.GetType().Name + "(" + FunctionName + ")";
        }

        public IOperationOrSignal Clone()
        {
            throw new Exception("Not yet supported");
        }
    }
}
