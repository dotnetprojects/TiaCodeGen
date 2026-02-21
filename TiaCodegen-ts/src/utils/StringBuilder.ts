export class StringBuilder {
    private parts: string[] = [];

    append(text: string): StringBuilder {
        this.parts.push(text);
        return this;
    }

    appendLine(text: string = ''): StringBuilder {
        this.parts.push(text + '\r\n');
        return this;
    }

    toString(): string {
        return this.parts.join('');
    }

    get length(): number {
        return this.parts.join('').length;
    }
}
