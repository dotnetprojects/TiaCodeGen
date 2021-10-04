using System;
using System.Collections.Generic;
using System.Linq;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public abstract class BaseOperationOrSignal : IOperationOrSignal
    {
        public string DebugInfo { get; set; }

        private ulong operationId;

        public BaseOperationOrSignal(params IOperationOrSignal[] operationOrSignals)
        {
            Children = new List<IOperationOrSignal>();
            if (operationOrSignals != null)
                Children.AddRange(operationOrSignals);
        }
        public virtual List<IOperationOrSignal> Children { get; set; }

        public ulong OperationId { get => operationId; 
            set => operationId = value; }

        public IOperationOrSignal Parent { get; set; }

        public bool DoNotCreateContact { get; set; }

        public virtual int Cardinality { get; set; }

        public virtual int CreateContactAndFillCardinality(IOperationOrSignal parent)
        {
            this.Cardinality = 1;

            if (Children.Count > 0 && Children.Last() is Or)
            {
                this.Cardinality = Children.Last().CreateContactAndFillCardinality(parent);
                Children.Last().DoNotCreateContact = true;
            }

            return this.Cardinality;
        }

        public void Add(params IOperationOrSignal[] operationOrSignals)
        {
            Children.AddRange(operationOrSignals);
        }

        public override string ToString()
        {
            if (this is And || this is Or)
            {
                return this.GetType().Name + " (" + string.Join(",", Children.Select(x => x.ToString())) + ")";
            }

            return this.GetType().Name;
        }

        public IOperationOrSignal GetFirstChildNotAnd()
        {
            if (this is And)
            {
                var ch1 = ((And)this).Children[0];
                if (ch1 is BaseOperationOrSignal)
                    return ((BaseOperationOrSignal)ch1).GetFirstChildNotAnd();
            }

            return this;
        }

        public IOperationOrSignal Clone()
        {
            try
            {
                var inst = (BaseOperationOrSignal)Activator.CreateInstance(this.GetType(), null);
                var props = this.GetType().GetProperties();
                foreach (var p in props)
                {
                    if (p.Name == "Children" || p.Name == "Parent" || p.Name == "SignalId" || p.Name == "OperationId" || p.Name == "Cardinality" || p.Name == "DoNotCreateContact")
                        continue;
                    p.SetValue(inst, p.GetValue(this));
                }
                foreach (var c in Children)
                {
                    inst.Children.Add(c.Clone());
                }

                return inst;
            }
            catch (Exception ex)
            {
                throw new Exception("Error Clone: " + this.GetType().Name, ex);
            }
        }
    }
}
