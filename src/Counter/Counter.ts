import { ICounter } from '../../types/ICounter';

export class Counter implements ICounter {
    children: Counter[] = [];
    destroyed: boolean = false;
    parent?: Counter;

    constructor(
        public value: number = 0,
    ) {}

    increase(): number {
        if (this.destroyed)
            throw new Error(`destroyed counter can not be increased`);

        return ++this.value;
    }

    getCount(): number {
        return this.value;
    }

    destroy() {
        this.destroyed = true;

        this.children.forEach(c => c.destroy());
    }

    detachChildren() {
        this.children.forEach(c => c.destroy());
        this.children = [];
    }

    spawn(): Counter {
        const child = new Counter();
        child.parent = this;

        this.children.push(child);

        return child;
    }
}
