using System;
using System.Collections.Generic;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public class Not : IOperationOrSignal
    {
        public string DebugInfo { get; set; }
        public string temp { get; set; }

        public Not(Signal signal)
        {
            Children = new List<IOperationOrSignal>();
            Children.Add(signal);
        }

        public virtual List<IOperationOrSignal> Children { get; set; }

        public ulong OperationId { get; set; }

        public bool DoNotCreateContact { get; set; }

        public int Cardinality { get; set; }

        public virtual int CreateContactAndFillCardinality(IOperationOrSignal parent)
        {
            this.Cardinality = 1;
            return this.Cardinality;
        }

        public IOperationOrSignal Parent { get; set; }

        public override string ToString()
        {
            return this.GetType().Name;
        }

        public IOperationOrSignal Clone()
        {
            try
            {
                var inst = (IOperationOrSignal)Activator.CreateInstance(this.GetType(), this.Children[0].Clone());
                return inst;
            }
            catch (Exception ex)
            {
                throw new Exception("Error Clone: " + this.GetType().Name, ex);
            }
        }
    }
}
