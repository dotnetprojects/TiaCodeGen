export class NaturalComparer {
    compare(x: string | null, y: string | null): number {
        if (x === y) return 0;
        if (x === null || x === undefined) return -1;
        if (y === null || y === undefined) return 1;

        let i = 0, j = 0;
        while (i < x.length && j < y.length) {
            const cx = x[i];
            const cy = y[j];
            if (this.isDigit(cx) && this.isDigit(cy)) {
                let vx = 0;
                while (i < x.length && this.isDigit(x[i])) {
                    vx = vx * 10 + (x.charCodeAt(i) - 48);
                    i++;
                }
                let vy = 0;
                while (j < y.length && this.isDigit(y[j])) {
                    vy = vy * 10 + (y.charCodeAt(j) - 48);
                    j++;
                }
                if (vx !== vy) return vx < vy ? -1 : 1;
            } else {
                const cmp = cx.toUpperCase().localeCompare(cy.toUpperCase());
                if (cmp !== 0) return cmp;
                i++;
                j++;
            }
        }
        return x.length - y.length;
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }
}
