using DotNetProjects.TiaCodegen.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using TiaCodegen.Blocks;
using TiaCodegen.Commands;
using TiaCodegen.Commands.Coils;
using TiaCodegen.Commands.Comparisons;
using TiaCodegen.Commands.Functions;
using TiaCodegen.Commands.Functions.Arithmetic;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;
using TiaCodegen.Internal;
using Convert = TiaCodegen.Commands.Convert;

namespace TiaCodegen.CodeGen
{
    public class KopCodeHelper
    {
        public static IEnumerable<T> FlattenOrdered<T>(IEnumerable<T> e, Func<T, IEnumerable<T>> f)
        {
            foreach (var el in e)
            {
                foreach (var el2 in FlattenOrdered(f(el), f))
                {
                    yield return el2;
                }
                yield return el;
            }
        }

        public KopCodeHelper(CodeBlock block)
        {
            _block = block;
            _sb = new StringBuilder();
        }

        private ulong _currentId = 21;
        private CodeBlock _block;
        private StringBuilder _sb;

        private void AddSignalDefinitions(Network network)
        {
            var signals = network.Children.Flatten(x => x.Children).OfType<Signal>();

            foreach (var signal in signals)
            {
                {
                    signal.AddXmlToStringBuilder(_currentId, _sb);
                    signal.SignalId = _currentId;
                    _currentId++;
                }
            }
        }

        private void CheckAndAndOr(CodeBlock block, Network network)
        {
            var ors = network.Children.Flatten(x => x.Children).OfType<Or>();

            foreach (var or in ors)
            {
                if (or.Children.Count() == 0)
                {
                    throw new Exception("Empty Or im Baustein \"" + block.Name + "\" Netzwerk \"" + network.NetworkTitle + "\"");
                }
            }
        }

        private void PrintTree(IOperationOrSignal signal, StringBuilder sb, int level = 0)
        {
            sb.AppendLine("".PadLeft(level * 4) + signal.ToString() + " OP ID: " + signal.OperationId);

            foreach (var s in signal.Children)
            {
                PrintTree(s, sb, level + 1);
            }
        }

        private void AddContactDefinitions(Network network, CodeBlock block)
        {
            var ops = FlattenOrdered(network.Children, x => x.Children).OfType<IOperationOrSignal>().ToList();

            foreach (var op in ops)
            {
                if (op is Signal)
                {
                    if ((!(op.Parent is ICoil)) && (!(op.Parent is Not)) && (!(op.Parent is FunctionCall)) && (!(op.Parent is CompareOperator)) && (!(op.Parent is Move)) && (!(op.Parent is Convert)) && (!(op.Parent is S_Move)))
                    {
                        op.OperationId = _currentId;
                        _currentId++;
                    }
                }
                else if (op is And || (op is Or && op.Children.Count == 1))
                {
                    op.OperationId = op.Children.Last().OperationId;
                }
                else
                {
                    op.OperationId = _currentId;
                    if (op is Not || op is ICoil || op is SystemFunctionBlockCall || op is SystemFunctionCall)
                    {
                        if (op.Children.Count > 0)
                            op.Children[0].OperationId = _currentId;
                    }

                    if (!(op is Distributor))
                        _currentId++;

                    if (op is Or && op.Children.Count > 1)
                    {
                        op.CreateContactAndFillCardinality(op);
                    }
                }
            }

            /*_sb.AppendLine("<!--");
			foreach (var op in ops)
            {
				_sb.AppendLine(op.ToString() + " -- " + op.OperationId);
			}
			_sb.AppendLine("-->");*/

            foreach (var op in ops)
            {
                var partname = op.GetType().Name;
                if (op is IPartName)
                {
                    partname = ((IPartName)op).PartName;
                }

                if (op is Signal)
                {
                    if ((!(op.Parent is ICoil)) && (!(op.Parent is Not)) && (!(op.Parent is FunctionCall)) && (!(op.Parent is CompareOperator)) && (!(op.Parent is Move)) && (!(op.Parent is Convert)) && (!(op.Parent is S_Move)))
                    {
                        _sb.AppendLine("<Part Name=\"Contact\" UId=\"" + op.OperationId + "\" />" + "<!-- " + ((Signal)op).Name + " -->");
                    }
                }
                else if (op is Or && op.Children.Count > 1)
                {
                    if (!op.DoNotCreateContact)
                    {
                        _sb.AppendLine("<Part Name=\"O\" UId=\"" + op.OperationId + "\">" + (debug ?? ("<!-- Or (Signals...) -->")));
                        _sb.AppendLine("<TemplateValue Name=\"Card\" Type=\"Cardinality\">" + op.Cardinality + "</TemplateValue>");
                        _sb.AppendLine("</Part>");
                    }
                }
                else if (op is CompareOperator)
                {
                    _sb.AppendLine("<Part Name=\"" + op.GetType().Name + "\" UId=\"" + op.OperationId + "\">");
                    var srctype = ((Signal)op.Children.First()).SignalType.ToString();
                    if (srctype.StartsWith("Constant"))
                        srctype = srctype.Substring(8);
                    _sb.AppendLine("<TemplateValue Name=\"SrcType\" Type=\"Type\">" + srctype + "</TemplateValue>");
                    _sb.AppendLine("</Part>");
                }
                else if (op is Ne)
                {
                    _sb.AppendLine("<Part Name=\"Ne\" UId=\"" + op.OperationId + "\">");
                    var srctype = ((Signal)op.Children.First()).SignalType.ToString();
                    if (srctype.StartsWith("Constant"))
                        srctype = srctype.Substring(8);
                    _sb.AppendLine("<TemplateValue Name=\"SrcType\" Type=\"Type\">" + srctype + "</TemplateValue>");
                    _sb.AppendLine("</Part>");
                }
                else if (op is Convert)
                {
                    _sb.AppendLine("<Part Name=\"" + op.GetType().Name + "\" UId=\"" + op.OperationId + "\">");
                    var srctype = ((Signal)op.Children.Last()).SignalType.ToString();
                    var desttype = ((Signal)op.Children.First()).SignalType.ToString();
                    if (srctype.StartsWith("Constant"))
                        srctype = srctype.Substring(8);
                    if (desttype.StartsWith("Constant"))
                        desttype = desttype.Substring(8);
                    _sb.AppendLine("<TemplateValue Name=\"SrcType\" Type=\"Type\">" + srctype + "</TemplateValue>");
                    _sb.AppendLine("<TemplateValue Name=\"DestType\" Type=\"Type\">" + desttype + "</TemplateValue>");
                    _sb.AppendLine("</Part>");
                }
                else if (op is Move)
                {
                    _sb.AppendLine("<Part Name=\"Move\" UId=\"" + op.OperationId + "\" " + (_block.Safety ? "" : "DisabledENO=\"true\"") + ">");
                    _sb.AppendLine("<TemplateValue Name=\"Card\" Type=\"Cardinality\">" + op.Cardinality + "</TemplateValue>");
                    _sb.AppendLine("</Part>");
                }
                else if (op is S_Move)
                {
                    _sb.AppendLine("<Part Name=\"S_Move\" UId=\"" + op.OperationId + "\" " + (_block.Safety ? "" : "DisabledENO=\"true\"") + " />");
                }
                else if (op is Not)
                {
                    _sb.AppendLine("<Part Name=\"Contact\" UId=\"" + op.OperationId + "\">");
                    _sb.AppendLine("<Negated Name=\"operand\"/>");
                    _sb.AppendLine("</Part>");
                }
                else if (op is ICoil)
                {
                    var coil = op as BaseCoil;
                    if (coil.Negated)
                    {
                        _sb.AppendLine("<Part Name=\"" + partname + "\" UId=\"" + op.OperationId + "\">" + "<!-- " + coil.Signal.Name + " -->");
                        _sb.AppendLine("	<Negated Name=\"operand\" />");
                        _sb.AppendLine("</Part>");
                    }
                    else
                    {
                        _sb.AppendLine("<Part Name=\"" + partname + "\" UId=\"" + op.OperationId + "\"/>" + "<!-- " + coil.Signal.Name + " -->");
                    }
                }
                else if (op is And || op is Or)
                { }
                else if (op is SystemFunctionBlockCall)
                {
                    var fc = (SystemFunctionBlockCall)op;

                    _sb.AppendLine("<Part Name=\"" + fc.FunctionName + "\" UId=\"" + op.OperationId + "\">");
                    if (fc.AdditionalInnerXml != null)
                        _sb.AppendLine(fc.AdditionalInnerXml);

                    var fb = (FunctionBlockCall)op;


                    if (fb.InstanceName.StartsWith("\""))
                    {
                        _sb.AppendLine("<Instance UId=\"" + _currentId + "\" Scope=\"GlobalVariable\">");
                        _currentId++;
                        _sb.AppendLine("<Component Name=\"" + fb.InstanceName.Replace("\"", "") + "\" />");
                        _sb.AppendLine("</Instance>");
                    }
                    else
                    {
                        _sb.AppendLine("<Instance UId=\"" + _currentId + "\" Scope=\"LocalVariable\">");
                        _currentId++;


                        foreach (var part in fb.InstanceName.Split('.')) // Aufsplitten von a.b.c in einzel Elemente
                        {
                            var idx = part.IndexOf("[") + 1; // Aufsplitten von Arrays
                            if (idx > 0)
                            {
                                _sb.AppendLine("<Component Name=\"" + part.Substring(0, idx - 1) + "\">");
                                var arrays = part.Substring(idx, part.Length - idx - 1);

                                if (arrays.Contains("\""))
                                {
                                    _sb.AppendLine("<Access Scope=\"GlobalConstant\">");
                                    _sb.AppendLine("<Constant Name=" + arrays + ">");
                                    _sb.AppendLine("</Constant>");
                                    _sb.AppendLine("</Access>");
                                }
                                else
                                {
                                    foreach (var arr in arrays.Split(','))
                                    {
                                        _sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + _currentId + "\" >");
                                        _currentId++;
                                        _sb.AppendLine("<Constant>");
                                        _sb.AppendLine("<ConstantType>DInt</ConstantType>");
                                        _sb.AppendLine("<ConstantValue>" + arr + "</ConstantValue>");
                                        _sb.AppendLine("</Constant>");
                                        _sb.AppendLine("</Access>");
                                    }
                                }
                            }
                            else
                            {
                                _sb.AppendLine("<Component Name=\"" + part + "\">");
                            }
                            _sb.AppendLine("</Component>");
                        }
                        _sb.AppendLine("</Instance>");
                    }
                    if (fc.TemplateValueName != null)
                    {
                        _sb.AppendLine("<TemplateValue Name=\"" + fc.TemplateValueName + "\" Type=\"" + fc.TemplateValueType + "\">" + fc.TemplateValue + "</TemplateValue>");
                        if (!string.IsNullOrEmpty(fc.SafetyTemplateString) && fc.TryGetParent<CodeBlock>()?.Safety == true)
                        {
                            _sb.AppendLine(fc.SafetyTemplateString);
                        }
                    }

                    if (_block.Safety && fc.AdditionalSafetyTemplateValues != null)
                    {
                        _sb.AppendLine(fc.AdditionalSafetyTemplateValues);
                    }
                    _sb.AppendLine("</Part>");
                }
                else if (op is SystemFunctionCall)
                {
                    var fc = (FunctionCall)op;

                    _sb.AppendLine("<Part Name=\"" + fc.FunctionName + "\" UId=\"" + op.OperationId + "\"" + (fc.DisableEno ? " DisabledENO=\"true\"" : "") + ">");
                    if (fc.AdditionalInnerXml != null)
                        _sb.AppendLine(fc.AdditionalInnerXml);

                    if (fc is ArithmeticCall)
                    {
                        if (fc is VariableArithmeticCall)
                        {
                            _sb.AppendLine("<TemplateValue Name=\"Card\" Type=\"Cardinality\">" + (fc.Children.Count() - 1) + "</TemplateValue>");
                        }
                        _sb.AppendLine("<TemplateValue Name=\"SrcType\" Type=\"Type\">" + ((ArithmeticCall)fc).Type + "</TemplateValue>");
                    }
                    else if (fc is InRangeCall || fc is OutRangeCall)
                    {
                        var srctype = ((Signal)op.Children.First()).SignalType.ToString();
                        if (srctype.StartsWith("Constant"))
                            srctype = srctype.Substring(8);
                        _sb.AppendLine("<TemplateValue Name=\"SrcType\" Type=\"Type\">" + srctype + "</TemplateValue>");
                    }
                    _sb.AppendLine("</Part>"); 
                }
                else if (op is FunctionCall)
                {
                    var fc = (FunctionCall)op;

                    if (op is AckGlCall)
                    {
                        _sb.AppendLine("<Part Name=\"ACK_GL\" Version=\"1.3\" UId=\"" + op.OperationId + "\">");
                    }
                    else if (op is FunctionBlockCall)
                    {
                        _sb.AppendLine("<Call UId=\"" + op.OperationId + "\">");
                        _sb.AppendLine("<CallInfo Name=\"" + fc.FunctionName + "\" BlockType=\"FB\">");
                    }
                    else
                    {
                        _sb.AppendLine("<Call UId=\"" + op.OperationId + "\">");
                        _sb.AppendLine("<CallInfo Name=\"" + fc.FunctionName + "\" BlockType=\"FC\">");
                    }
                    if (op is FunctionBlockCall)
                    {
                        var fb = (FunctionBlockCall)op;

                        if (fb.InstanceName.StartsWith("\""))
                        {
                            var name = fb.InstanceName.Replace("\"", "");
                            _sb.AppendLine("<Instance UId=\"" + _currentId + "\" Scope=\"GlobalVariable\">");
                        }
                        else
                        {
                            _sb.AppendLine("<Instance UId=\"" + _currentId + "\" Scope=\"LocalVariable\">");
                        }
                        _currentId++;

                        foreach (var part in fb.InstanceName.Split('.')) // Aufsplitten von a.b.c in einzel Elemente
                        {
                            string instanceNamePart;
                            if (part.StartsWith("\""))
                            {
                                instanceNamePart = part.Replace("\"", "");
                            }
                            else
                            {
                                instanceNamePart = part;
                            }

                            var idx = instanceNamePart.IndexOf("[") + 1; // Aufsplitten von Arrays
                            if (idx > 0)
                            {
                                _sb.AppendLine("<Component Name=\"" + instanceNamePart.Substring(0, idx - 1) + "\">");
                                var arrays = instanceNamePart.Substring(idx, instanceNamePart.Length - idx - 1);

                                if (arrays.Contains("\""))
                                {
                                    _sb.AppendLine("<Access Scope=\"GlobalConstant\">");
                                    _sb.AppendLine("<Constant Name=" + arrays + ">");
                                    _sb.AppendLine("</Constant>");
                                    _sb.AppendLine("</Access>");
                                }
                                else
                                {
                                    foreach (var arr in arrays.Split(','))
                                    {
                                        _sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + _currentId + "\" >");
                                        _currentId++;
                                        _sb.AppendLine("<Constant>");
                                        _sb.AppendLine("<ConstantType>DInt</ConstantType>");
                                        _sb.AppendLine("<ConstantValue>" + arr + "</ConstantValue>");
                                        _sb.AppendLine("</Constant>");
                                        _sb.AppendLine("</Access>");
                                    }
                                }
                            }
                            else
                            {
                                _sb.AppendLine("<Component Name=\"" + instanceNamePart + "\">");
                            }
                            _sb.AppendLine("</Component>");
                        }
                        _sb.AppendLine("</Instance>");
                    }

                    if (op is AckGlCall)
                    {
                        _sb.AppendLine("<TemplateValue Name=\"f_user_card\" Type=\"Cardinality\">1</TemplateValue>");
                        _sb.AppendLine("<TemplateValue Name=\"f_image_card\" Type=\"Cardinality\">0</TemplateValue>");
                        _sb.AppendLine("<TemplateValue Name=\"codedbool_type\" Type=\"Type\">DInt</TemplateValue>");
                        _sb.AppendLine("</Part>");
                    }
                    else
                    {
                        foreach (var intf in fc.Interface)
                        {
                            if (intf.Value.Direction != Direction.Eno)
                            {
                                var type = "Bool";

                                if (intf.Value.OperationOrSignal is Signal)
                                {
                                    if (((Signal)intf.Value.OperationOrSignal).SignalType == SignalType.Custom)
                                    {
                                        type = ((Signal)intf.Value.OperationOrSignal).CustomType;
                                    }
                                    else
                                    {
                                        type = ((Signal)intf.Value.OperationOrSignal).SignalType.ToString();
                                    }
                                }

                                if (type != "Constant" && type.StartsWith("Constant"))
                                {
                                    type = type.Substring(8);
                                }

                                type = intf.Value.Type.HasValue ? intf.Value.Type.Value.ToString() : type;
                                if (intf.Value.Length > 0)
                                {
                                    _sb.AppendLine("<Parameter Name=\"" + intf.Key + "\" Section=\"" + intf.Value.Direction.ToString() + "\" Type=\"" + type + "[" + intf.Value.Length + "]\" />");
                                }
                                else
                                {
                                    _sb.AppendLine("<Parameter Name=\"" + intf.Key + "\" Section=\"" + intf.Value.Direction.ToString() + "\" Type=\"" + type + "\" />");
                                }
                            }
                        }

                        _sb.AppendLine("</CallInfo>");
                        _sb.AppendLine("</Call>");
                    }
                }
            }
        }

        static string debug = "";

        private void AddWires(IOperationOrSignal op)
        {
            if (op.Children != null)
            {
                foreach (var lop in op.Children)
                {
                    AddWires(lop);
                }
            }

            if (op is FunctionCall)
            {
                var fc = (FunctionCall)op;
                foreach (var intf in fc.Interface)
                {
                    var sng = intf.Value.OperationOrSignal;
                    if (fc is ArithmeticCall && sng == null)
                    {

                    }
                    else if (sng == null)
                    {
                        _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire 1 FunctionCall -->")));
                        _currentId++;
                        _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"" + intf.Key + "\" />");
                        _sb.AppendLine("<OpenCon UId=\"" + _currentId + "\" />");
                        _currentId++;
                        _sb.AppendLine("</Wire>");
                    }
                    else if (intf.Value.Direction == Direction.Input || intf.Value.Direction == Direction.InOut)
                    {
                        _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire 2 FunctionCall -->")));
                        if (sng is Signal)
                        {
                            _sb.AppendLine("<IdentCon UId=\"" + ((Signal)sng).SignalId + "\" />" + "  <!-- " + ((Signal)sng).Name + " -->");
                        }
                        else
                        {
                            if (sng is Or)
                            {
                                _sb.AppendLine("<NameCon UId=\"" + sng.OperationId + "\" Name=\"out\" />");
                            }
                            else
                            {
                                _sb.AppendLine("<NameCon UId=\"" + sng.Children.Last().OperationId + "\" Name=\"out\" />");
                            }
                        }
                        _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"" + intf.Key + "\" />");
                        _sb.AppendLine("</Wire>");
                        _currentId++;
                    }
                    else if (intf.Value.Direction == Direction.Eno)
                    {
                        _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire 3 FunctionCall -->")));
                        _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"eno\" />");
                        _sb.AppendLine("<NameCon UId=\"" + sng.Children.Last().OperationId + "\" Name=\"in\" />");
                        _sb.AppendLine("</Wire>");
                        _currentId++;
                    }
                    else
                    {
                        _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire 4 FunctionCall -->")));
                        _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"" + intf.Key + "\" />");
                        if (sng is Distributor db)
                        {
                            _sb.AppendLine("<!-- Distributor -->");
                            foreach (var c in db.Children)
                            {
                                if (c is Signal)
                                {
                                    _sb.AppendLine("<IdentCon UId=\"" + ((Signal)c).SignalId + "\" />" + "  <!-- " + ((Signal)c).Name + " -->");
                                }
                                else if (c is And && c.Children.FirstOrDefault() is Or)
                                {
                                    foreach(var chIn in c.Children.FirstOrDefault().Children)
                                    {
                                        foreach (var ch in GetAllOrSignals(chIn))
                                        {
                                            var inName = ch is FunctionCall ? ((ch is InRangeCall || ch is OutRangeCall) ? "pre" : "en") : "in";
                                            _sb.AppendLine("<NameCon UId=\"" + ch.OperationId + "\" Name=\"" + inName + "\" />");
                                        }
                                    }
                                }
                                else
                                {
                                    var inName = c is FunctionCall ? ((c is InRangeCall || c is OutRangeCall) ? "pre" : "en") : "in";
                                    _sb.AppendLine("<NameCon UId=\"" + c.OperationId + "\" Name=\"" + inName + "\" />");
                                }
                            }
                        }
                        else
                        {                            
                            if (sng is Signal)
                            {
                                _sb.AppendLine("<IdentCon UId=\"" + ((Signal)sng).SignalId + "\" />" + "  <!-- " + ((Signal)sng).Name + " -->");
                            }
                            else
                            {
                                var inName = sng is FunctionCall ? ((sng is InRangeCall || sng is OutRangeCall) ? "pre" : "en") : "in";
                                _sb.AppendLine("<NameCon UId=\"" + sng.OperationId + "\" Name=\"" + inName + "\" />");
                            }
                        }
                        _sb.AppendLine("</Wire>");
                        _currentId++;
                    }
                }
            }
            else if (op is Signal && (!(op.Parent is FunctionCall)) && (!(op.Parent is CompareOperator)) && (!(op.Parent is Move)) && (!(op.Parent is Convert)) && (!(op.Parent is S_Move)))
            {
                _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire Parent FunctionCall (Parent:" + op.Parent.ToString() + ") -->")));
                _sb.AppendLine("<IdentCon UId=\"" + ((Signal)op).SignalId + "\" />" + "  <!-- " + ((Signal)op).Name + " -->");

                var tname = "operand";
                if (op.Parent is BaseNPCoil)
                    tname = "bit";
                _sb.AppendLine("<NameCon UId=\"" + ((Signal)op).OperationId + "\" Name=\"" + tname + "\" />" + "  <!-- " + ((Signal)op).Name + " -->");
                _sb.AppendLine("</Wire>");
                _currentId++;
            }
            else if (op is Or && op.Children.Count > 1)
            {               
                int i = 1;
                foreach (var ch in op.Children)
                {
                    if (ch is And && ch.Children.Last() is Or) //Todo nur ein letztes or im End, könnte weiter verschachtelt sein
                    {
                        foreach (var ch2 in ch.Children.Last().Children)
                        {
                            _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire 1 Or -->")));
                            _sb.AppendLine("<NameCon UId=\"" + ch2.OperationId + "\" Name=\"out\" />" + "  <!-- " + ch2.ToString() + " -->");
                            _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"in" + i + "\" />" + "  <!-- " + op.ToString() + " -->");
                            _sb.AppendLine("</Wire>");
                            i++;
                            _currentId++;
                        }
                    }
                    else
                    {
                        if (!op.DoNotCreateContact)
                        {
                            _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire 2 Or -->")));
                            _sb.AppendLine("<NameCon UId=\"" + ch.OperationId + "\" Name=\"out\" />" + "  <!-- " + ch.ToString() + " -->");
                            _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"in" + i + "\" />" + "  <!-- " + op.ToString() + " -->");
                            _sb.AppendLine("</Wire>");
                            i++;
                            _currentId++;
                        }
                    }
                }
            }
            else if (op is CompareOperator)
            {
                int i = 1;
                foreach (var ch in op.Children)
                {
                    _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire CompareOperator -->")));
                    _sb.AppendLine("<IdentCon UId=\"" + ((Signal)ch).SignalId + "\" />" + "  <!-- " + ch.ToString() + " -->");
                    _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"in" + i + "\" />" + "  <!-- " + op.ToString() + " -->");
                    _sb.AppendLine("</Wire>");
                    i++;
                    _currentId++;
                }
            }
            else if (op is Move || op is S_Move || op is Convert)
            {

                _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire Move or S_Move -->")));
                _sb.AppendLine("<IdentCon UId=\"" + ((Signal)op.Children[op.Children.Count() - 1]).SignalId + "\" />" + "  <!-- " + ((Signal)op.Children[op.Children.Count() - 1]).Name + " -->");
                _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"in\" />" + "  <!-- " + op.ToString() + " -->");
                _sb.AppendLine("</Wire>");
                _currentId++;
                if (op is S_Move)
                {
                    _sb.AppendLine("<Wire UId=\"" + _currentId + "\">");
                    _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"out" + "\" />" + "  <!-- " + op.ToString() + " -->");
                    _sb.AppendLine("<IdentCon UId=\"" + ((Signal)op.Children[0]).SignalId + "\" />" + "  <!-- " + ((Signal)op.Children[0]).Name + " -->");
                    _sb.AppendLine("</Wire>");
                    _currentId++;
                }
                else if (op is Convert)
                {
                    _sb.AppendLine("<Wire UId=\"" + _currentId + "\">");
                    _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"out" + "\" />" + "  <!-- " + op.GetType().Name + " -->");
                    _sb.AppendLine("<IdentCon UId=\"" + ((Signal)op.Children[0]).SignalId + "\" />" + "  <!-- " + ((Signal)op.Children[0]).Name + " -->");
                    _sb.AppendLine("</Wire>");
                    _currentId++;
                }
                else
                {
                    for (int n = 0; n < op.Children.Count() - 1; n++)
                    {
                        _sb.AppendLine("<Wire UId=\"" + _currentId + "\">");
                        _sb.AppendLine("<NameCon UId=\"" + op.OperationId + "\" Name=\"out" + (n + 1).ToString() + "\" />" + "  <!-- " + op.GetType().Name + " -->");
                        _sb.AppendLine("<IdentCon UId=\"" + ((Signal)op.Children[n]).SignalId + "\" />" + "  <!-- " + ((Signal)op.Children[n]).Name + " -->");
                        _sb.AppendLine("</Wire>");
                        _currentId++;
                    }
                }
            }
            else if (op is And || op is Or)
            {
                for (int n = 0; n < op.Children.Count - 1; n++)
                {
                    var ch = op.Children[n];
                    var next = op.Children[n + 1];
                    if (next is Or)
                    {
                        _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire And next Or -->")));
                        _sb.AppendLine("<NameCon UId=\"" + ch.OperationId + "\" Name=\"out\" />");
                        foreach (var orSignal in next.Children)
                        {
                            foreach (var os in GetAllOrSignals(orSignal))
                            {
                                var opId = os.OperationId;
                                var ipName = "in";

                                if (os is BaseOperationOrSignal && (((BaseOperationOrSignal)os).GetFirstChildNotAnd() is CompareOperator || ((BaseOperationOrSignal)os).GetFirstChildNotAnd() is InRangeCall || ((BaseOperationOrSignal)os).GetFirstChildNotAnd() is OutRangeCall))
                                {
                                    ipName = "pre";
                                }
                                _sb.AppendLine("<NameCon UId=\"" + opId + "\" Name=\"" + ipName + "\" />");
                            }
                        }
                        _sb.AppendLine("</Wire>");
                        _currentId++;
                    }
                    else
                    {
                        _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire And -->")));
                        var outName = "out";
                        if (ch is FunctionCall || ch is S_Move || ch is Move || ch is Convert)
                            outName = "eno";

                        var srcName = ch is Signal ? ((Signal)ch).Name : ch.GetType().Name;
                        var dstName = next is Signal ? ((Signal)next).Name : next.GetType().Name;
                        _sb.AppendLine("<NameCon UId=\"" + ch.OperationId + "\" Name=\"" + outName + "\" />" + "  <!-- " + srcName + " -->");
                        if (next is CompareOperator || next is InRangeCall || next is OutRangeCall)
                        {
                            _sb.AppendLine("<NameCon UId=\"" + next.OperationId + "\" Name=\"pre\" />" + "  <!-- " + dstName + " -->");
                        }
                        else if (next is FunctionCall)
                        {
                            _sb.AppendLine("<NameCon UId=\"" + next.OperationId + "\" Name=\"" + (((FunctionCall)next).HasNoEn ? "in" : "en") + "\" />" + "  <!-- " + dstName + " -->");
                        }
                        else if (next is IFunctionOperation)
                        {
                            _sb.AppendLine("<NameCon UId=\"" + next.OperationId + "\" Name=\"en\" />" + "  <!-- " + dstName + " -->");
                        }
                        else if (next is Distributor)
                        {
                            _sb.AppendLine("<!-- Distributor -->");
                            foreach (var c in next.Children)
                            {
                                var akC = c;
                                if (c is ICoil && c.Children.Count > 0)
                                {
                                    akC = c.Children.Last();
                                }
                                else if (c is And && c.Children.Count > 0)
                                {
                                    akC = c.Children.First();
                                }

                                var l = new List<IOperationOrSignal>() { akC };
                                if (akC is Or)
                                    l = akC.Children;

                                foreach (var sIn in l)
                                {
                                    foreach (var s in GetAllOrSignals(sIn))
                                    {
                                        if (s is CompareOperator || s is InRangeCall || s is OutRangeCall)
                                        {
                                            _sb.AppendLine("<NameCon UId=\"" + s.OperationId + "\" Name=\"pre\" />" + "  <!-- " + s.GetType().Name + " -->");
                                        }
                                        else if (s is FunctionCall || s is IFunctionOperation)
                                        {
                                            _sb.AppendLine("<NameCon UId=\"" + s.OperationId + "\" Name=\"en\" />" + "  <!-- " + s.GetType().Name + " -->");
                                        }
                                        else
                                        {
                                            _sb.AppendLine("<NameCon UId=\"" + s.OperationId + "\" Name=\"in\" />" + "  <!-- " + s.GetType().Name + " -->");
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            _sb.AppendLine("<NameCon UId=\"" + next.OperationId + "\" Name=\"in\" />" + "  <!-- " + dstName + " -->");
                        }
                        _sb.AppendLine("</Wire>");
                        _currentId++;
                    }
                }
            }
            else if (op is ICoil)
            {
                if (op.Children.Count() > 1)
                {
                    IOperationOrSignal ch = null;
                    if (op.Children[1] is Signal)
                        ch = op.Children[1];
                    else
                        ch = op.Children[1].Children.Last();

                    if (op.Children[1] is Or || op.Children[1] is CompareOperator || op.Children[1] is Move || op.Children[1] is Convert || op.Children[1] is S_Move || op.Children[1] is ICoil)
                    {
                        ch = op.Children.Last();
                    }
                    var sig = op.Children[0];

                    var outName = "out";
                    if (ch is FunctionCall || ch is Move || ch is S_Move || ch is Convert)
                        outName = "eno";

                    _sb.AppendLine("<Wire UId=\"" + _currentId + "\">" + (debug ?? ("<!-- Wire " + op.ToString() + " -->")));
                    _sb.AppendLine("<NameCon UId=\"" + ch.OperationId + "\" Name=\"" + outName + "\" />" + "  <!-- " + ch.GetType().Name + (ch is Signal ? " (" + ((Signal)ch).Name + ")" : "") + " -->");
                    _sb.AppendLine("<NameCon UId=\"" + sig.OperationId + "\" Name=\"in\" />" + "  <!-- " + sig.GetType().Name + (sig is Signal ? " (" + ((Signal)sig).Name + ")" : "") + " -->");
                    _sb.AppendLine("</Wire>");
                    _currentId++;
                }
            }
        }

        private void AddPowerrails(Network network)
        {
            var ops = FlattenOrdered(network.Children, x => x.Children).OfType<IOperationOrSignal>();
            _sb.AppendLine("<Wire UId=\"" + _currentId + "\">");
            _sb.AppendLine("<Powerrail />");

            foreach (var s in ops)
            {
                bool noPowerRail = false;
                IOperationOrSignal p = s;

                if (s is FunctionCall)
                {
                    while (p.Parent != null)
                    {
                        var pp = p.Parent;
                        if (pp is And || pp is CompareOperator || pp is Convert || pp is Move || pp is S_Move || pp is Convert)
                        {
                            if (pp.Children.IndexOf(p) > 0)
                                noPowerRail = true;
                        }

                        p = p.Parent;

                        if (noPowerRail)
                            break;
                    }
                    if (!noPowerRail)
                    {
                        if (s is InRangeCall || s is OutRangeCall)
                        {
                            _sb.AppendLine("<NameCon UId=\"" + s.OperationId + "\" Name=\"pre\" />" + "  <!-- " + ((FunctionCall)s).FunctionName + " -->");
                        }
                        else
                        {
                            _sb.AppendLine("<NameCon UId=\"" + s.OperationId + "\" Name=\"en\" />" + "  <!-- " + ((FunctionCall)s).FunctionName + " -->");
                        }
                    }
                    noPowerRail = true;
                }
                else if (s.Parent is FunctionCall)
                {
                    noPowerRail = true;
                }
                else if ((s.Parent is ICoil) && s.Parent.Children.IndexOf(p) == 0)
                {
                    noPowerRail = true;
                }
                else if ((s is Coil || s is SCoil || s is RCoil) && s.Children.Count() == 1 && s.Children[0] is Signal && (s.Parent == null || s.Parent is Network))
                {
                    _sb.AppendLine("<NameCon UId=\"" + s.OperationId + "\" Name=\"in\" />" + "  <!-- " + s.ToString() + " - " + s.Children[0].ToString() + " -->");
                }
                else if (s is Signal sng)
                {
                    if (p.Parent is FunctionCall)
                        noPowerRail = true;
                    else
                        while (p.Parent != null)
                        {
                            var pp = p.Parent;
                            if (pp is And || pp is CompareOperator || pp is Convert || pp is Move || pp is S_Move || pp is Convert)
                            {
                                if (pp.Children.IndexOf(p) > 0)
                                    noPowerRail = true;
                            }
                            else if (pp is FunctionCall)
                                break;

                            p = p.Parent;

                            if (noPowerRail)
                                break;
                        }
                }

                if (!noPowerRail && s is Signal)
                {
                    var sng = s as Signal;

                    var par = s.Parent;

                    if (par is CompareOperator)
                    {
                        _sb.AppendLine("<NameCon UId=\"" + par.OperationId + "\" Name=\"pre\" />" + "  <!-- " + par.GetType().Name + " -->");
                    }
                    else if (par is Move || par is S_Move || par is Convert)
                    {
                        _sb.AppendLine("<NameCon UId=\"" + par.OperationId + "\" Name=\"en\" />" + "  <!-- " + par.GetType().Name + " -->");
                    }
                    else
                    {
                        _sb.AppendLine("<NameCon UId=\"" + sng.OperationId + "\" Name=\"in\" />" + "  <!-- " + sng.Name + " -->");
                    }
                }
            }
            _sb.AppendLine("</Wire>");
            _currentId++;

        }

        private void FixChildAndsAndSingleOr(IOperationOrSignal s)
        {
            bool fixAgain = false;
            List<IOperationOrSignal> newChildren = new List<IOperationOrSignal>();
            if (s != null && s.Children != null)
            {
                if (s is ICoil && s.Children.Count == 2 && s.Children[1] is Signal)  // Coils at least need one And or Or, so to fix insert one
                {
                    s.Children[1] = new And(s.Children[1]);
                }
                else
                {
                    foreach (var op in s.Children.ToList())
                    {
                        if ((s is And || s is Or) && op is Or && op.Children.Count == 1) // include a single or to the parent when it's a and or a or
                        {
                            foreach (var p in op.Children)
                            {
                                newChildren.Add(p);
                                fixAgain = true;
                            }
                        }
                        else if (s is And && op is And)
                        {
                            foreach (var p in op.Children)
                            {
                                newChildren.Add(p);
                                s.Children.Add(p);
                                fixAgain = true;
                            }
                        }
                        else
                        {
                            newChildren.Add(op);
                            FixChildAndsAndSingleOr(op);
                        }

                    }

                    s.Children = newChildren;

                    if (fixAgain)
                        FixChildAndsAndSingleOr(s);
                }
            }
        }

        private string EscapeForXml(string text)
        {
            return text.Replace("<", "&lt;").Replace(">", "&gt;");
        }

        private string PrintTreeParent(IOperationOrSignal signal)
        {
            if (signal != null)
            {
                var t = "";
                if (signal is Signal)
                {
                    t = " (" + ((Signal)signal).Name + ")";
                }
                if (signal is Coil)
                {
                    t = " (" + ((Coil)signal).Signal.Name + ")";
                }
                if (signal is Network)
                {
                    t = " (" + ((Network)signal).NetworkTitle ?? "" + ")";
                }
                if (signal is CodeBlock)
                {
                    t = " (" + ((CodeBlock)signal).Name ?? "" + ")";
                }
                var p = PrintTreeParent(signal.Parent);
                return (p != "" ? p + " -> " : "") + signal.GetType().Name + t;
            }
            return "";
        }

        private void SetParent(IOperationOrSignal s)
        {
            foreach (var op in s.Children)
            {
                if (op.Parent != null)
                {
                    throw new Exception("\n\nIOperationOrSignal reused wich is not valid!\n" + PrintTreeParent(op.Parent) + "\n\n" + PrintTreeParent(s) + "\n\n");
                }
                op.Parent = s;
                SetParent(op);
            }
        }

       
        public string GetXml(ref int id)
        {
            FixChildAndsAndSingleOr(_block);
            SetParent(_block);
            var networks = _block.Children.Flatten(x => x.Children).OfType<Network>();

            foreach (var network in networks)
            {
                CheckAndAndOr(_block, network);
                try
                {
                    _sb.AppendLine("<SW.Blocks.CompileUnit ID=\"" + id + "\" CompositionName=\"CompileUnits\"> <!--" + EscapeForXml(network.NetworkTitle).Replace("-", "") + "-->");
                    id++;
                    _sb.AppendLine("<AttributeList>");
                    if (network.Children.Count() > 0)
                    {
                        _sb.AppendLine("<NetworkSource><FlgNet xmlns=\"http://www.siemens.com/automation/Openness/SW/NetworkSource/FlgNet/v1\">");
                        _sb.AppendLine("<Parts>");
                        AddSignalDefinitions(network);
                        AddContactDefinitions(network, _block);
                        _sb.AppendLine("</Parts>");
                        _sb.AppendLine("<Wires>");
                        AddPowerrails(network);
                        AddWires(network);
                        _sb.AppendLine("</Wires>");
                        _sb.AppendLine("</FlgNet></NetworkSource>");
                    }
                    _sb.AppendLine("<ProgrammingLanguage>" + (_block.Safety ? "F_LAD" : "LAD") + "</ProgrammingLanguage>");
                    _sb.AppendLine("</AttributeList>");
                    _sb.AppendLine("<ObjectList>");

                    // Add Comment to Network
                    _sb.AppendLine("<MultilingualText ID=\"" + id + "\" CompositionName=\"Comment\">");
                    id++;
                    _sb.AppendLine("<ObjectList>");
                    _sb.AppendLine("<MultilingualTextItem ID=\"" + id + "\" CompositionName=\"Items\">");
                    id++;
                    _sb.AppendLine("<AttributeList>");
                    _sb.AppendLine("<Culture>de-DE</Culture>");
                    _sb.AppendLine("<Text>" + network.Description + "</Text>");
                    _sb.AppendLine("</AttributeList>");
                    _sb.AppendLine("</MultilingualTextItem>");
                    _sb.AppendLine("<MultilingualTextItem ID=\"" + id + "\" CompositionName=\"Items\">");
                    id++;
                    _sb.AppendLine("<AttributeList>");
                    _sb.AppendLine("<Culture>en-GB</Culture>");
                    _sb.AppendLine("<Text>" + network.DescriptionEnglish + "</Text>");
                    _sb.AppendLine("</AttributeList>");
                    _sb.AppendLine("</MultilingualTextItem>");
                    _sb.AppendLine("</ObjectList>");
                    _sb.AppendLine("</MultilingualText>");

                    _sb.AppendLine("<MultilingualText ID=\"" + id + "\" CompositionName=\"Title\">");
                    id++;
                    _sb.AppendLine("<ObjectList>");
                    _sb.AppendLine("<MultilingualTextItem ID=\"" + id + "\" CompositionName=\"Items\">");
                    id++;
                    _sb.AppendLine("<AttributeList>");
                    _sb.AppendLine("<Culture>de-DE</Culture>");
                    _sb.AppendLine("<Text>" + EscapeForXml(network.NetworkTitle) + "</Text>");
                    _sb.AppendLine("</AttributeList>");
                    _sb.AppendLine("</MultilingualTextItem>");
                    _sb.AppendLine("<MultilingualTextItem ID=\"" + id + "\" CompositionName=\"Items\">");
                    id++;
                    _sb.AppendLine("<AttributeList>");
                    _sb.AppendLine("<Culture>en-GB</Culture>");
                    _sb.AppendLine("<Text>" + EscapeForXml(network.NetworkTitleEnglish) + "</Text>");
                    _sb.AppendLine("</AttributeList>");
                    _sb.AppendLine("</MultilingualTextItem>");
                    _sb.AppendLine("</ObjectList>");
                    _sb.AppendLine("</MultilingualText>");
                    _sb.AppendLine("</ObjectList>");
                    _sb.AppendLine("</SW.Blocks.CompileUnit>");
                }
                catch (Exception ex)
                {
                    throw new Exception("Error generating Network: " + network.NetworkTitle + " in Block: " + _block.Name, ex); //todo: add block name
                }
            }
            /*_sb.AppendLine("<!--");
			_sb.AppendLine("<!--");
			PrintTree(_block, _sb);
			_sb.AppendLine("-->");*/
            return _sb.ToString();
        }

        public IEnumerable<IOperationOrSignal> GetAllOrSignals(IOperationOrSignal sng)
        {
            if (sng is And)
            {
                if (sng.Children.First() is Or or)
                {
                    foreach (var o in or.Children)
                    {
                        foreach (var a in GetAllOrSignals(o))
                            yield return a;
                    }
                }
                else
                {
                    yield return ((And)sng).Children.First();
                }
            }
            else
            {
                yield return sng;
            }
        }
    }
}
