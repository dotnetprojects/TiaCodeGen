import { CodeBlock } from './CodeBlock';
export declare class Block {
    name: string;
    number: number;
    private codeBlock;
    title: string | undefined;
    titleEnglish: string | undefined;
    comment: string | undefined;
    commentEnglish: string | undefined;
    author: string | undefined;
    blockInterface: string;
    constructor(name: string, title: string, codeBlock: CodeBlock);
    getCode(): string;
    getBlockHeader(idRef: {
        value: number;
    }): string;
    getBlockFooter(idRef: {
        value: number;
    }): string;
}
//# sourceMappingURL=Block.d.ts.map