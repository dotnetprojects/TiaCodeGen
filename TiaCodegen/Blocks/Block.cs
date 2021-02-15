using TiaCodegen.CodeGen;

namespace TiaCodegen.Blocks
{
    public class Block
    {
        public string Name { get; set; }
        public int Number { get; set; }
        private readonly CodeBlock CodeBlock;
        public string Title { get; set; }
        public string TitleEnglish { get; set; }
        public string Comment { get; set; }
        public string CommentEnglish { get; set; }
        public string Author { get; set; }

        public string Interface { get; set; }
        public Block(string name, string title, CodeBlock codeBlock)
        {
            this.Name = name;
            this.Title = title;
            this.CodeBlock = codeBlock;

            this.Interface = $@"
      <Interface>
        <Sections xmlns=""http://www.siemens.com/automation/Openness/SW/Interface/v2"">
          <Section Name=""Input"" />
          <Section Name=""Output"" />
          <Section Name=""InOut"" />
          <Section Name=""Temp"" />
          <Section Name=""Constant"" />
          <Section Name=""Return"">
            <Member Name=""Ret_Val"" Datatype=""Void"" />
          </Section>
        </Sections>
      </Interface>
";
        }

        public virtual string GetCode()
        {
            var id = 0;
            var code = GetBlockHeader(ref id);
            code += new KopCodeHelper(CodeBlock).GetXml(ref id);
            code += GetBlockFooter(ref id);
            return code;
        }

        public virtual string GetBlockHeader(ref int id)
        {
            var header = $@"  
<SW.Blocks.FC ID=""{id++}"">
    <AttributeList>
      {(Author != null ? "<HeaderAuthor>" + Author + "</HeaderAuthor>" : "")}
      <HeaderFamily>General</HeaderFamily>
      <HeaderVersion>1.0</HeaderVersion>
      <MemoryLayout>Optimized</MemoryLayout>
      <Name>{Name}</Name>
 {(Number != 0 ? "<Number>" + Number + "</Number>" : "")}
      <ProgrammingLanguage>LAD</ProgrammingLanguage>
    </AttributeList>
    <ObjectList>";
            return header;
        }

        public virtual string GetBlockFooter(ref int id)
        {
            var footer = $@"  
      <MultilingualText ID=""{id++}"" CompositionName=""Title"">
        <ObjectList>
          <MultilingualTextItem ID=""{id++}"" CompositionName=""Items"">
            <AttributeList>
              <Culture>de-DE</Culture>
              <Text>{Title}</Text>
            </AttributeList>
          </MultilingualTextItem>
          <MultilingualTextItem ID=""{id++}"" CompositionName=""Items"">
            <AttributeList>
              <Culture>en-GB</Culture>
              <Text>{TitleEnglish}</Text>
            </AttributeList>
          </MultilingualTextItem>
        </ObjectList>
      </MultilingualText>
      <MultilingualText ID=""{id++}"" CompositionName=""Comment"">
        <ObjectList>
          <MultilingualTextItem ID=""{id++}"" CompositionName=""Items"">
            <AttributeList>
              <Culture>de-DE</Culture>
              <Text>{Comment}</Text>
            </AttributeList>
          </MultilingualTextItem>
          <MultilingualTextItem ID=""{id++}"" CompositionName=""Items"">
            <AttributeList>
              <Culture>en-GB</Culture>
              <Text>{CommentEnglish}</Text>
            </AttributeList>
          </MultilingualTextItem>
        </ObjectList>
      </MultilingualText>
    </ObjectList>
  </SW.Blocks.FC>";
            return footer;
        }
    }
}
