import { CodeBlock } from './CodeBlock';
import { KopCodeHelper } from '../CodeGen/KopCodeHelper';

export class Block {
    name: string;
    number: number = 0;
    private codeBlock: CodeBlock;
    title: string | undefined;
    titleEnglish: string | undefined;
    comment: string | undefined;
    commentEnglish: string | undefined;
    author: string | undefined;
    blockInterface: string;

    constructor(name: string, title: string, codeBlock: CodeBlock) {
        this.name = name;
        this.title = title;
        this.codeBlock = codeBlock;

        this.blockInterface = `
      <Interface>
        <Sections xmlns="http://www.siemens.com/automation/Openness/SW/Interface/v2">
          <Section Name="Input" />
          <Section Name="Output" />
          <Section Name="InOut" />
          <Section Name="Temp" />
          <Section Name="Constant" />
          <Section Name="Return">
            <Member Name="Ret_Val" Datatype="Void" />
          </Section>
        </Sections>
      </Interface>
`;
    }

    getCode(): string {
        const idRef = { value: 0 };
        let code = this.getBlockHeader(idRef);
        code += new KopCodeHelper(this.codeBlock).getXml(idRef);
        code += this.getBlockFooter(idRef);
        return code;
    }

    getBlockHeader(idRef: { value: number }): string {
        const header = `  
<SW.Blocks.FC ID="${idRef.value++}">
    <AttributeList>
      ${this.author !== undefined && this.author !== null ? '<HeaderAuthor>' + this.author + '</HeaderAuthor>' : ''}
      <HeaderFamily>General</HeaderFamily>
      <HeaderVersion>1.0</HeaderVersion>
      <MemoryLayout>Optimized</MemoryLayout>
      <Name>${this.name}</Name>
 ${this.number !== 0 ? '<Number>' + this.number + '</Number>' : ''}
      <Namespace />
      <ProgrammingLanguage>LAD</ProgrammingLanguage>
    </AttributeList>
    <ObjectList>`;
        return header;
    }

    getBlockFooter(idRef: { value: number }): string {
        const footer = `  
      <MultilingualText ID="${idRef.value++}" CompositionName="Title">
        <ObjectList>
          <MultilingualTextItem ID="${idRef.value++}" CompositionName="Items">
            <AttributeList>
              <Culture>de-DE</Culture>
              <Text>${this.title}</Text>
            </AttributeList>
          </MultilingualTextItem>
          <MultilingualTextItem ID="${idRef.value++}" CompositionName="Items">
            <AttributeList>
              <Culture>en-GB</Culture>
              <Text>${this.titleEnglish ?? ''}</Text>
            </AttributeList>
          </MultilingualTextItem>
        </ObjectList>
      </MultilingualText>
      <MultilingualText ID="${idRef.value++}" CompositionName="Comment">
        <ObjectList>
          <MultilingualTextItem ID="${idRef.value++}" CompositionName="Items">
            <AttributeList>
              <Culture>de-DE</Culture>
              <Text>${this.comment ?? ''}</Text>
            </AttributeList>
          </MultilingualTextItem>
          <MultilingualTextItem ID="${idRef.value++}" CompositionName="Items">
            <AttributeList>
              <Culture>en-GB</Culture>
              <Text>${this.commentEnglish ?? ''}</Text>
            </AttributeList>
          </MultilingualTextItem>
        </ObjectList>
      </MultilingualText>
    </ObjectList>
  </SW.Blocks.FC>`;
        return footer;
    }
}
